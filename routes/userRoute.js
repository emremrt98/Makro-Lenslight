import express from "express";
import * as userController from "../controllers/userController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get(
  "/dashboard",
  authMiddleware.authenticateToken,
  userController.getDashboardPage
);
router.get("/", authMiddleware.authenticateToken, userController.getAllUsers);
router.get("/:id", authMiddleware.authenticateToken, userController.getAUser);
router.put("/:id/follow", authMiddleware.authenticateToken, userController.follow);
router.put("/:id/unfollow", authMiddleware.authenticateToken, userController.unfollow);
export default router;
