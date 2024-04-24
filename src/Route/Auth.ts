
import BulkRegister from "@/Controllers/Auth/BulkRegister/BulkRegister.controller";
import BulkRegisterValidate from "@/Controllers/Auth/BulkRegister/BulkRegister.validator";
import Login from "@/Controllers/Auth/Login/Login.controller";
import LoginValidate from "@/Controllers/Auth/Login/Login.validator";
import Profile from "@/Controllers/Auth/Profile/Profile.controller";
import Refresh from "@/Controllers/Auth/Refresh/Refresh.controller";
import VerifyAdmin from "@/Middleware/VerifyAdmin";
import VerifyFaculty from "@/Middleware/VerifyFaculty";
import VerifyToken from "@/Middleware/VerifyToken";
import { Router } from "express";
import multer from "multer";
import ValidateEmailToken from "@/Controllers/Auth/ValidateEmailToken/ValidateEmailToken.controller";
import ValidateEmailTokenValidate from "@/Controllers/Auth/ValidateEmailToken/ValidateEmailToken.validator";
import SaveNewUserValidate from "@/Controllers/Auth/SaveNewUser/SaveNewUser.validator";
import SaveNewUser from "@/Controllers/Auth/SaveNewUser/SaveNewUser.controller";

const router = Router();

const protectedRouter = Router();
const adminRouter = Router();
const publicRouter = Router();
const facultyRouter = Router();
const upload = multer({ dest: "files/" });

protectedRouter.use(VerifyToken)
facultyRouter.use(VerifyFaculty);
adminRouter.use(VerifyAdmin)

publicRouter.post('/login',LoginValidate,Login)
publicRouter.get('/refresh', Refresh)
publicRouter.get('/validate/:token', ValidateEmailTokenValidate, ValidateEmailToken);
publicRouter.post('/new-account', SaveNewUserValidate, SaveNewUser);
adminRouter.post('/register/bulk', upload.single("file"), BulkRegisterValidate, BulkRegister);

protectedRouter.get('/profile', Profile);

protectedRouter.use("/", facultyRouter);
protectedRouter.use("/", adminRouter);
router.use("/", publicRouter);
router.use("/", protectedRouter);
export default router;
