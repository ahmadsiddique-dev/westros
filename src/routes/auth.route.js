import { Router } from "express";
import {
    handleLogin,
    handleSignup,
    handleRefresh,
    handleLogout,
} from "../controllers/auth.controller.js";

const Authrouter = Router();

Authrouter.route("/login").post(handleLogin);
Authrouter.route("/signup").post(handleSignup);
Authrouter.route("/refresh").post(handleRefresh);
Authrouter.route("/logout").post(handleLogout);

export { Authrouter };
