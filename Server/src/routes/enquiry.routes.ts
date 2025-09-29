import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry/enquiry.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createEnquirySchema, updateEnquirySchema } from '../lib/validation';

const router = Router();

/**
 * @swagger
 * /enquiries/{id}/assign:
 *   put:
 *     summary: Assign enquiry to a user (admin/staff only)
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to assign
 *     responses:
 *       200:
 *         description: Enquiry assigned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id/assign', authenticate, EnquiryController.assignEnquiry);

/**
 * @swagger
 * /enquiries:
 *   post:
 *     summary: Create a new enquiry
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEnquiryRequest'
 *     responses:
 *       201:
 *         description: Enquiry created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  validate(createEnquirySchema),
  EnquiryController.createEnquiry
);

/**
 * @swagger
 * /enquiries:
 *   get:
 *     summary: Get all enquiries (with filters)
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filter by assigned user
 *     responses:
 *       200:
 *         description: List of enquiries
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, EnquiryController.getEnquiries);

/**
 * @swagger
 * /enquiries/{id}:
 *   get:
 *     summary: Get a single enquiry by ID
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     responses:
 *       200:
 *         description: Enquiry details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticate, EnquiryController.getEnquiryById);

/**
 * @swagger
 * /enquiries/{id}:
 *   put:
 *     summary: Update an enquiry
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEnquiryRequest'
 *     responses:
 *       200:
 *         description: Enquiry updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.put(
  '/:id',
  authenticate,
  validate(updateEnquirySchema),
  EnquiryController.updateEnquiry
);

/**
 * @swagger
 * /enquiries/{id}:
 *   delete:
 *     summary: Delete an enquiry
 *     tags: [Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquiry ID
 *     responses:
 *       200:
 *         description: Enquiry deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, EnquiryController.deleteEnquiry);

export default router;
