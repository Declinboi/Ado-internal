import express from "express";
import { UserController } from "../controllers/userController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();
const userController = new UserController();

router
.route("/")
.post( userController.createUser.bind(userController))
.get(authenticate, authorizeAdmin, userController.getAllUsers.bind(userController))

router.post("/auth", userController.loginUser.bind(userController));
router.post("/google-login",userController.googleLogin.bind(userController));
router.post("/logout", userController.logoutUser.bind(userController));
router.post("/verify-email", userController.verifyEmail.bind(userController));
router.post("/forgot-password",userController.forgotPassword.bind(userController));
router.post("/reset-password/:token",userController.resetPassword.bind(userController));

router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, userController.deleteUserById.bind(userController))
  .get(authenticate, authorizeAdmin, userController.getUserById.bind(userController))
  .put(authenticate, authorizeAdmin, userController.updateUserById.bind(userController));

export default router;
