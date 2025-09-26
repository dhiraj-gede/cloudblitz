"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// filepath: h:/Gremio/cloudblitz/Server/src/routes/enquiry.routes.ts
const express_1 = require("express");
const enquiry_controller_1 = require("../controllers/enquiry/enquiry.controller");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const validation_2 = require("../lib/validation");
const router = (0, express_1.Router)();
/**
 * Enquiry Management Routes
 * @route /api/enquiries
 */
// Create enquiry - anyone can create
router.post('/', (0, validation_1.validate)(validation_2.createEnquirySchema), enquiry_controller_1.EnquiryController.createEnquiry);
// Get enquiries with filters - requires authentication
router.get('/', auth_1.authenticate, enquiry_controller_1.EnquiryController.getEnquiries);
// Get single enquiry - requires authentication
router.get('/:id', auth_1.authenticate, enquiry_controller_1.EnquiryController.getEnquiryById);
// Update enquiry - requires authentication
router.put('/:id', auth_1.authenticate, (0, validation_1.validate)(validation_2.updateEnquirySchema), enquiry_controller_1.EnquiryController.updateEnquiry);
// Delete enquiry - requires authentication
router.delete('/:id', auth_1.authenticate, enquiry_controller_1.EnquiryController.deleteEnquiry);
exports.default = router;
