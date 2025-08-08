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

//secure routes
router.use(verifyJwt);

router.route("/logout").post(logout);
router.route("/renew").post(renewSession);
router.route("/change-avatar").post(upload.single("avatar"), changeAvatar);
router.route("/update-user").post(updateUser);
router.route("/change-password").post(changePassword);
router.route("/get-user").get(getUser);

export default router;
