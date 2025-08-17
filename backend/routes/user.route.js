import { Router } from "express";
import {
  registerUser,
  login,
  logout,
  renewSession,
  changeAvatar,
  getUser,
  changePassword,
  updateUser,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/login").post(login);

router.route("/renew").post(renewSession);

//secure routes
router.use(verifyJwt);

router.route("/logout").post(logout);
router
  .route("/change-avatar")
  .put(upload.fields([{ name: "avatar", maxCount: 1 }]), changeAvatar);
router.route("/update-user").put(updateUser);
router.route("/change-password").post(changePassword);
router.route("/get-user").get(getUser);

export default router;
