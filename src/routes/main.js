import { Router } from "express";
import { Authrouter } from "./auth.route.js";


const router = Router();

router.use('/auth', Authrouter);

export default router;