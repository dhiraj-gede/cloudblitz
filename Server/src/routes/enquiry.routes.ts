// filepath: h:/Gremio/cloudblitz/Server/src/routes/enquiry.routes.ts
import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry/enquiry.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createEnquirySchema, updateEnquirySchema } from '../lib/validation';

const router = Router();

/**
 * Enquiry Management Routes
 * @route /api/enquiries
 */

// Create enquiry - anyone can create
router.post(
  '/',
  validate(createEnquirySchema),
  EnquiryController.createEnquiry
);

// Get enquiries with filters - requires authentication
router.get('/', authenticate, EnquiryController.getEnquiries);

// Get single enquiry - requires authentication
router.get('/:id', authenticate, EnquiryController.getEnquiryById);

// Update enquiry - requires authentication
router.put(
  '/:id',
  authenticate,
  validate(updateEnquirySchema),
  EnquiryController.updateEnquiry
);

// Delete enquiry - requires authentication
router.delete('/:id', authenticate, EnquiryController.deleteEnquiry);

export default router;
