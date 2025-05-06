import express from "express";

import { UserController } from "../controllers/userController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

const userController = new UserController();

router
.route("/")
.post( userController.createUser.bind(userController))
// .get()

// router
//   .route("/")
//   .post(createUser)
//   .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", userController.loginUser.bind(userController) );
router.post("/logout", userController.logoutUser.bind(userController));
router.post("/verify-email", userController.verifyEmail.bind(userController));
router.post("/forgot-password",userController.forgotPassword.bind(userController));
router.post("/reset-password/:token",userController.resetPassword.bind(userController));


// router
//   .route("/:id")
//   .delete(authenticate, authorizeAdmin, deleteUserById)
//   .get(authenticate, authorizeAdmin, getUserById)
//   .put(authenticate, authorizeAdmin, updateUserById);

export default router;
