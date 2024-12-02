import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	setAddressData,
	userEmails,
	addPermissions,
	setPermissions
} from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const userRoute = express.Router();

userRoute.get("/check-auth",  authMiddleware, checkAuth);

userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.post("/logout", logout);

userRoute.post("/add-permissions",authMiddleware, addPermissions);
userRoute.post("/set-permissions",adminMiddleware, setPermissions);


userRoute.post("/weryfikacja", verifyEmail);
userRoute.post("/forgot-password", forgotPassword);

userRoute.get("/emails",adminMiddleware,userEmails);
userRoute.post("/reset-password/:token", resetPassword);
userRoute.post("/podsumowanie/:token", setAddressData);


export default userRoute;
