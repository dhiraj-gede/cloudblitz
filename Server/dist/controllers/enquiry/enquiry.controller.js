"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryController = void 0;
const Enquiry_1 = require("../../models/Enquiry");
const response_1 = require("../../lib/response");
const mongoose_1 = __importDefault(require("mongoose"));
class EnquiryController {
    /**
     * Create a new enquiry
     * @route POST /api/enquiries
     */
    static async createEnquiry(req, res) {
        try {
            const enquiryData = req.body;
            // Add the creator if authenticated
            if (req.user) {
                enquiryData.createdBy = req.user._id;
            }
            const enquiry = new Enquiry_1.Enquiry(enquiryData);
            await enquiry.save();
            response_1.ResponseHelper.created(res, enquiry, 'Enquiry created successfully');
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error creating enquiry');
        }
    }
    /**
     * Get all enquiries with filtering
     * @route GET /api/enquiries
     */
    static async getEnquiries(req, res) {
        try {
            const filters = req.query;
            const { page = 1, limit = 10 } = filters;
            // Build query
            const query = {};
            // Only show non-deleted enquiries
            query.deletedAt = null;
            // Apply filters
            if (filters.status)
                query.status = filters.status;
            if (filters.priority)
                query.priority = filters.priority;
            if (filters.assignedTo)
                query.assignedTo = filters.assignedTo;
            // Search functionality
            if (filters.search) {
                query.$text = { $search: filters.search };
            }
            // Date range filters
            if (filters.startDate || filters.endDate) {
                query.createdAt = {};
                if (filters.startDate)
                    query.createdAt.$gte = filters.startDate;
                if (filters.endDate)
                    query.createdAt.$lte = filters.endDate;
            }
            // For non-admin users, limit to assigned enquiries or created by them
            if (req.user && req.user.role !== 'admin') {
                query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
            }
            const total = await Enquiry_1.Enquiry.countDocuments(query);
            // Get enquiries with pagination
            const enquiries = await Enquiry_1.Enquiry.find(query)
                .populate('assignedTo', 'name email')
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
            response_1.ResponseHelper.paginated(res, enquiries, page, limit, total);
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error fetching enquiries');
        }
    }
    /**
     * Get enquiry by ID
     * @route GET /api/enquiries/:id
     */
    static async getEnquiryById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                response_1.ResponseHelper.badRequest(res, 'Invalid enquiry ID');
                return;
            }
            const enquiry = await Enquiry_1.Enquiry.findOne({ _id: id, deletedAt: null })
                .populate('assignedTo', 'name email')
                .populate('createdBy', 'name email');
            if (!enquiry) {
                response_1.ResponseHelper.notFound(res, 'Enquiry not found');
                return;
            }
            // Check permissions for non-admin users
            if (req.user && req.user.role !== 'admin') {
                const isOwner = enquiry.createdBy &&
                    enquiry.createdBy.toString() === req.user._id.toString();
                const isAssignee = enquiry.assignedTo &&
                    enquiry.assignedTo.toString() === req.user._id.toString();
                if (!isOwner && !isAssignee) {
                    response_1.ResponseHelper.forbidden(res, 'You do not have permission to access this enquiry');
                    return;
                }
            }
            response_1.ResponseHelper.success(res, enquiry);
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error fetching enquiry');
        }
    }
    /**
     * Update enquiry
     * @route PUT /api/enquiries/:id
     */
    static async updateEnquiry(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                response_1.ResponseHelper.badRequest(res, 'Invalid enquiry ID');
                return;
            }
            // Find enquiry
            const enquiry = await Enquiry_1.Enquiry.findOne({ _id: id, deletedAt: null });
            if (!enquiry) {
                response_1.ResponseHelper.notFound(res, 'Enquiry not found');
                return;
            }
            // Check permissions for non-admin users
            if (req.user && req.user.role !== 'admin' && req.user.role !== 'staff') {
                if (!enquiry.createdBy ||
                    enquiry.createdBy.toString() !== req.user._id.toString()) {
                    response_1.ResponseHelper.forbidden(res, 'You do not have permission to update this enquiry');
                    return;
                }
                // Regular users can only update basic details, not status or assignment
                delete updateData.status;
                delete updateData.assignedTo;
            }
            // Update the enquiry
            const updatedEnquiry = await Enquiry_1.Enquiry.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).populate('assignedTo', 'name email');
            response_1.ResponseHelper.success(res, updatedEnquiry, 'Enquiry updated successfully');
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error updating enquiry');
        }
    }
    /**
     * Soft delete enquiry
     * @route DELETE /api/enquiries/:id
     */
    static async deleteEnquiry(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                response_1.ResponseHelper.badRequest(res, 'Invalid enquiry ID');
                return;
            }
            // Find enquiry
            const enquiry = await Enquiry_1.Enquiry.findOne({ _id: id, deletedAt: null });
            if (!enquiry) {
                response_1.ResponseHelper.notFound(res, 'Enquiry not found');
                return;
            }
            // Check permissions - only admin or creator can delete
            if (req.user && req.user.role !== 'admin') {
                if (!enquiry.createdBy ||
                    enquiry.createdBy.toString() !== req.user._id.toString()) {
                    response_1.ResponseHelper.forbidden(res, 'You do not have permission to delete this enquiry');
                    return;
                }
            }
            // Soft delete by setting deletedAt
            await Enquiry_1.Enquiry.findByIdAndUpdate(id, { deletedAt: new Date() });
            response_1.ResponseHelper.success(res, null, 'Enquiry deleted successfully');
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error deleting enquiry');
        }
    }
}
exports.EnquiryController = EnquiryController;
