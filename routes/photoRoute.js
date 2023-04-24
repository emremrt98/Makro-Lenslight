import express from "express";
import * as photoController from "../controllers/photoController.js";

const router = express.Router();

router.post("/", photoController.createPhoto);
router.get("/", photoController.getAllPhotos);
router.get("/:id", photoController.getAPhotos);
router.delete("/:id", photoController.deletePhoto);
export default router;
