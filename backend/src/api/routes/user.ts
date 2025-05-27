import express from "express";
import login from "../user-login.js";
import signup from "../user-signup.js";
import changePassword from "../user-change-password.js";
import getUser from "../get-user.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/change-password", auth, changePassword);
router.get("/", auth, getUser);

export default router; 