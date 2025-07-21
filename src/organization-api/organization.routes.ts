import { Router } from "express";
import * as ctrl from "./organization.controllers";
import { authenticateJWT } from "../auth/auth.middleware";

const router = Router();

// All routes require authentication except public organizations
router.post("/create", authenticateJWT, ctrl.createOrganization);
router.get("/get/:id", authenticateJWT, ctrl.getOrganizationById);
router.get('/list', authenticateJWT, ctrl.getOrganizationsByUser);
router.patch("/update/:id", authenticateJWT, ctrl.updateOrganization);
router.delete("/delete/:id", authenticateJWT, ctrl.deleteOrganization);
router.post("/regenerate-api-key/:id", authenticateJWT, ctrl.regenerateApiKey);
router.patch('/update-selected', authenticateJWT, ctrl.updateSelectedOrganization);

// Public route
router.get("/public", ctrl.getPublicOrganizations);

export default router;
