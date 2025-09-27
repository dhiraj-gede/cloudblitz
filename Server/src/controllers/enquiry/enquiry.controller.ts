// Move this method inside the EnquiryController class
// filepath: h:/Gremio/cloudblitz/Server/src/controllers/enquiry.controller.ts
import { Response } from 'express';
import { Enquiry } from '../../models/Enquiry';
import { ResponseHelper } from '../../lib/response';
import { AuthRequest } from '../../middlewares/auth';
import {
  CreateEnquiryInput,
  UpdateEnquiryInput,
  EnquiryFilters,
} from '../../lib/validation';
import { User } from '../../models/User';
import mongoose from 'mongoose';

export class EnquiryController {
  /**
   * Assign enquiry to a user (manual)
   * @route PUT /api/enquiries/:id/assign
   */
  static async assignEnquiry(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        ResponseHelper.badRequest(res, 'Invalid enquiry or user ID');
        return;
      }
      // Only admin or staff can assign
      if (
        !req.user ||
        (req.user.role !== 'admin' && req.user.role !== 'staff')
      ) {
        ResponseHelper.forbidden(
          res,
          'You do not have permission to assign enquiries'
        );
        return;
      }
      const enquiry = await Enquiry.findOne({ _id: id, deletedAt: null });
      if (!enquiry) {
        ResponseHelper.notFound(res, 'Enquiry not found');
        return;
      }
      enquiry.assignedTo = userId;
      await enquiry.save();
      ResponseHelper.success(res, enquiry, 'Enquiry assigned successfully');
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error assigning enquiry'
      );
    }
  }
  /**
   * Create a new enquiry
   * @route POST /api/enquiries
   */
  static async createEnquiry(req: AuthRequest, res: Response): Promise<void> {
    try {
      const enquiryData: CreateEnquiryInput = req.body;

      // Add the creator if authenticated
      if (req.user) {
        enquiryData.createdBy = req.user._id;
      }

      // Round robin assignment logic
      if (enquiryData.autoAssign) {
        // Only assign to active staff/admin
        console.log('Auto-assigning enquiry...');
        const users = await User.find({
          isActive: true,
          role: { $in: ['admin', 'staff'] },
        }).sort({ createdAt: 1 });
        if (users.length === 0) {
          ResponseHelper.badRequest(
            res,
            'No active staff/admin users available for assignment'
          );
          return;
        }
        console.log(
          'Found users for assignment:',
          users.map(u => u.email)
        );
        // Find last assigned enquiry
        const lastEnquiry = await Enquiry.findOne({
          assignedTo: { $in: users.map(u => u._id) },
        }).sort({ createdAt: -1 });
        console.log('Last assigned enquiry:', lastEnquiry);
        let nextUser;
        if (!lastEnquiry) {
          nextUser = users[0];
        } else {
          const lastIndex = users.findIndex(
            u => u._id.toString() === lastEnquiry.assignedTo?.toString()
          );
          nextUser = users[(lastIndex + 1) % users.length];
        }
        console.log('Assigning to user:', nextUser.email);
        enquiryData.assignedTo = nextUser._id;
      }

      const enquiry = new Enquiry(enquiryData);
      await enquiry.save();

      ResponseHelper.created(res, enquiry, 'Enquiry created successfully');
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error creating enquiry'
      );
    }
  }

  /**
   * Get all enquiries with filtering
   * @route GET /api/enquiries
   */
  static async getEnquiries(req: AuthRequest, res: Response): Promise<void> {
    try {
      const filters: EnquiryFilters = req.query as unknown as EnquiryFilters;
      const { page = 1, limit = 10 } = filters;

      // Build query
      const query: mongoose.FilterQuery<typeof Enquiry> = {};

      // Only show non-deleted enquiries
      query.deletedAt = null;

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
      if (filters.assignedTo) query.assignedTo = filters.assignedTo;

      // Search functionality
      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      // Date range filters
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = filters.startDate;
        if (filters.endDate) query.createdAt.$lte = filters.endDate;
      }

      // For non-admin users, limit to assigned enquiries or created by them
      if (req.user && req.user.role !== 'admin') {
        query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
      }

      const total = await Enquiry.countDocuments(query);

      // Get enquiries with pagination
      const enquiries = await Enquiry.find(query)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      ResponseHelper.paginated(res, enquiries, page, limit, total);
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error fetching enquiries'
      );
    }
  }

  /**
   * Get enquiry by ID
   * @route GET /api/enquiries/:id
   */
  static async getEnquiryById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        ResponseHelper.badRequest(res, 'Invalid enquiry ID');
        return;
      }

      const enquiry = await Enquiry.findOne({ _id: id, deletedAt: null })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      if (!enquiry) {
        ResponseHelper.notFound(res, 'Enquiry not found');
        return;
      }

      // Check permissions for non-admin users
      if (req.user && req.user.role !== 'admin') {
        const isOwner =
          enquiry.createdBy &&
          enquiry.createdBy.toString() === req.user._id.toString();
        const isAssignee =
          enquiry.assignedTo &&
          enquiry.assignedTo.toString() === req.user._id.toString();

        if (!isOwner && !isAssignee) {
          ResponseHelper.forbidden(
            res,
            'You do not have permission to access this enquiry'
          );
          return;
        }
      }

      ResponseHelper.success(res, enquiry);
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error fetching enquiry'
      );
    }
  }

  /**
   * Update enquiry
   * @route PUT /api/enquiries/:id
   */
  static async updateEnquiry(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateEnquiryInput = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        ResponseHelper.badRequest(res, 'Invalid enquiry ID');
        return;
      }

      // Find enquiry
      const enquiry = await Enquiry.findOne({ _id: id, deletedAt: null });

      if (!enquiry) {
        ResponseHelper.notFound(res, 'Enquiry not found');
        return;
      }

      // Check permissions for non-admin users
      if (req.user && req.user.role !== 'admin' && req.user.role !== 'staff') {
        if (
          !enquiry.createdBy ||
          enquiry.createdBy.toString() !== req.user._id.toString()
        ) {
          ResponseHelper.forbidden(
            res,
            'You do not have permission to update this enquiry'
          );
          return;
        }

        // Regular users can only update basic details, not status or assignment
        delete updateData.status;
        delete updateData.assignedTo;
      }

      // Round robin assignment logic for update
      if (updateData.autoAssign) {
        const users = await User.find({
          isActive: true,
          role: { $in: ['admin', 'staff'] },
        }).sort({ createdAt: 1 });
        if (users.length === 0) {
          ResponseHelper.badRequest(
            res,
            'No active staff/admin users available for assignment'
          );
          return;
        }
        const lastEnquiry = await Enquiry.findOne({
          assignedTo: { $in: users.map(u => u._id) },
        }).sort({ createdAt: -1 });
        let nextUser;
        if (!lastEnquiry) {
          nextUser = users[0];
        } else {
          const lastIndex = users.findIndex(
            u => u._id.toString() === lastEnquiry.assignedTo?.toString()
          );
          nextUser = users[(lastIndex + 1) % users.length];
        }
        updateData.assignedTo = nextUser._id;
      }

      // Update the enquiry
      const updatedEnquiry = await Enquiry.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('assignedTo', 'name email');

      ResponseHelper.success(
        res,
        updatedEnquiry,
        'Enquiry updated successfully'
      );
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error updating enquiry'
      );
    }
  }

  /**
   * Soft delete enquiry
   * @route DELETE /api/enquiries/:id
   */
  static async deleteEnquiry(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        ResponseHelper.badRequest(res, 'Invalid enquiry ID');
        return;
      }

      // Find enquiry
      const enquiry = await Enquiry.findOne({ _id: id, deletedAt: null });

      if (!enquiry) {
        ResponseHelper.notFound(res, 'Enquiry not found');
        return;
      }

      // Check permissions - only admin or creator can delete
      if (req.user && req.user.role !== 'admin') {
        if (
          !enquiry.createdBy ||
          enquiry.createdBy.toString() !== req.user._id.toString()
        ) {
          ResponseHelper.forbidden(
            res,
            'You do not have permission to delete this enquiry'
          );
          return;
        }
      }

      // Soft delete by setting deletedAt
      await Enquiry.findByIdAndUpdate(id, { deletedAt: new Date() });

      ResponseHelper.success(res, null, 'Enquiry deleted successfully');
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error deleting enquiry'
      );
    }
  }
}
