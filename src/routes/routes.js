import { Router } from "express";
import routerUser from "../components/user/user.routes.js";
import authRouter from "../services/auth/auth.routes.js";
import routerSala from "../components/sala/sala.routes.js";
import geminiApiRouter from "../components/AI/geminiApi.routes.js";
import routerBook from "../components/book/book.routes.js";
import routerRole from "../components/role/role.routes.js";
import routerChapter from "../components/chapter/chapter.routes.js";
import routerBookVersion from "../components/bookVersion/bookVersion.routes.js";

const router = Router(); 
router.use('/usuario', routerUser); 
router.use('/sala', routerSala); 
router.use('/auth', authRouter);
router.use('/ai-gemini', geminiApiRouter);
router.use('/books', routerBook);
router.use('/roles', routerRole);
router.use('/chapters', routerChapter);
router.use('/bookVersions', routerBookVersion);

export default router;


