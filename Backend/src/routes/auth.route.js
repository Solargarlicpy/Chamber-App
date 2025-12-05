import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// note: get not used becuase we dont user data to cache in logout. Best practice to use post 
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export { router as default };