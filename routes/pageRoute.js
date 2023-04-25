import express from "express";
import * as pageController from "../controllers/pageController.js";

const router = express.Router();

router.get("/", pageController.getIndexPage);
router.get("/about", pageController.getAboutPage);
router.get("/register", pageController.getRegisterPage);
router.get("/contact", pageController.getContactPage);
router.post("/contact", pageController.sendMail);
router.get("/login", pageController.getLoginPage);
router.get("/logout", pageController.getLogout);
export default router;
