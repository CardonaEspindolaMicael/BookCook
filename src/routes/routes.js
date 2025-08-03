import { Router } from "express";
import routerUser from "../components/user/user.routes.js";
import authRouter from "../services/auth/auth.routes.js";
import aiWritingRouter from "../components/AI/aiWritingAssistant.routes.js";
import routerBook from "../components/book/book.routes.js";
import routerRole from "../components/role/role.routes.js";
import routerChapter from "../components/chapter/chapter.routes.js";
import routerGenre from "../components/genre/genre.routes.js";
import routerBookGenre from "../components/bookGenre/bookGenre.routes.js";
import routerChapterIndex from "../components/chapterIndex/chapterIndex.routes.js"

const router = Router(); 
router.use('/usuario', routerUser); 
router.use('/auth', authRouter);
router.use('/ai-writing', aiWritingRouter);
router.use('/books', routerBook);
router.use('/roles', routerRole);
router.use('/chapters', routerChapter);
router.use('/genre', routerGenre);
router.use('/book-genre', routerBookGenre);
router.use('/chapters-index', routerChapterIndex)

export default router;


