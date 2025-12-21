import express from "express";
import { CreateService, deleteServiceById, getALlServices, getServicesById } from "../controllers/serviceController.js";

const ServiceRoutes=express.Router();

ServiceRoutes.post('/create',CreateService);
ServiceRoutes.get('/',getALlServices);
ServiceRoutes.get('/:_id',getServicesById);
ServiceRoutes.delete('/:id',deleteServiceById)

export default ServiceRoutes;