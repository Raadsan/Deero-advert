import express from "express";
import { 
    getCompanyContacts, 
    createCompanyContact, 
    updateCompanyContact, 
    deleteCompanyContact,
    syncCompanyContacts,
} from "../controllers/companyContactController.js";

const router = express.Router();

router.get("/", getCompanyContacts);
router.post("/sync", syncCompanyContacts);   // must be before /:id
router.post("/", createCompanyContact);
router.put("/:id", updateCompanyContact);
router.delete("/:id", deleteCompanyContact);

export default router;
