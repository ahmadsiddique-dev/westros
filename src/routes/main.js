import { Router } from "express";
import { Authrouter } from "./auth.route.js";


const router = Router();

router.use('/auth', Authrouter);
router.use('/got/:house', GOTRouter)
router.use('/hotd/:house', HOTDRouter)

export default router;
