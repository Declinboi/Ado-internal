import express from "express";

import { UserController } from "../controllers/userController";
// import { authenticate, authorizeAdmin } from "../middlewares/authHandler";

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
// router.post("/logout", logoutUser);

// router
//   .route("/profile")
//   .get(authenticate, getCurrentUserProfile)
//   .put(authenticate, updateCurrentUserProfile);

// router
//   .route("/:id")
//   .delete(authenticate, authorizeAdmin, deleteUserById)
//   .get(authenticate, authorizeAdmin, getUserById)
//   .put(authenticate, authorizeAdmin, updateUserById);

export default router;
