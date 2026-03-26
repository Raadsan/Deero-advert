import express from "express";
import upload from "../utils/multer.js";
import { CreateService, deleteServiceById, getALlServices, getServicesById, updateServiceById } from "../controllers/serviceController.js";
import { protect } from "../middlewares/authMiddleware.js";
const ServiceRoutes = express.Router();

// Create service: accept multipart/form-data with required file field `serviceIcon` (or aliases: icon, service_icon)
ServiceRoutes.post('/create', upload.any(), CreateService);
ServiceRoutes.get('/', protect, getALlServices);
ServiceRoutes.get('/:_id', protect, getServicesById);
ServiceRoutes.patch('/:id', protect, upload.any(), updateServiceById);
ServiceRoutes.delete('/:id', protect, deleteServiceById);

export default ServiceRoutes;