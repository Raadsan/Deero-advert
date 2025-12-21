import express from "express";
import upload from "../utils/multer.js";
import { CreateService, deleteServiceById, getALlServices, getServicesById, updateServiceById } from "../controllers/serviceController.js";

const ServiceRoutes = express.Router();

// Create service: accept multipart/form-data with required file field `serviceIcon` (or aliases: icon, service_icon)
ServiceRoutes.post('/create', upload.any(), CreateService);
ServiceRoutes.get('/', getALlServices);
ServiceRoutes.get('/:_id', getServicesById);
ServiceRoutes.put('/:id', upload.any(), updateServiceById);
ServiceRoutes.patch('/:id', upload.any(), updateServiceById);
ServiceRoutes.delete('/:id', deleteServiceById);

export default ServiceRoutes;