import AllUsers from "@/Controllers/Admin/AllUsers/AllUsers.controller";
import AllUsersValidate from "@/Controllers/Admin/AllUsers/AllUsers.validator";
import CheckEmail from "@/Controllers/Admin/CheckEmail/CheckEmail.controller";
import CheckEmailValidate from "@/Controllers/Admin/CheckEmail/CheckEmail.validator";
import CheckUsername from "@/Controllers/Admin/CheckUsername/CheckUsername.controller";
import CheckUsernameValidate from "@/Controllers/Admin/CheckUsername/CheckUsername.validator";
import DeleteUser from "@/Controllers/Admin/DeleteUser/DeleteUser.controller";
import DeleteUserValidate from "@/Controllers/Admin/DeleteUser/DeleteUser.validator";
import InviteFaculty from "@/Controllers/Admin/InviteFaculty/InviteFaculty.controller";
import InviteFacultyValidate from "@/Controllers/Admin/InviteFaculty/InviteFaculty.validator";
import UpdateBatches from "@/Controllers/Admin/UpdateBatches/UpdateBatches.controller";
import UpdateBatchesValidate from "@/Controllers/Admin/UpdateBatches/UpdateBatches.validator";
import VerifyAdmin from "@/Middleware/VerifyAdmin";
import VerifyToken from "@/Middleware/VerifyToken";
import { Router } from "express";


const router = Router();
const protectedRouter = Router();
const adminRouter = Router();


protectedRouter.use(VerifyToken)
adminRouter.use(VerifyAdmin);
adminRouter.post('/invite-faculty', InviteFacultyValidate, InviteFaculty);
adminRouter.get('/users', AllUsersValidate, AllUsers);
adminRouter.delete('/users/:userId', DeleteUserValidate, DeleteUser);
adminRouter.put('/batches', UpdateBatchesValidate, UpdateBatches);
protectedRouter.get('/check-username', CheckUsernameValidate, CheckUsername);
protectedRouter.get('/check-email', CheckEmailValidate, CheckEmail);
protectedRouter.use("/", adminRouter);
router.use("/", protectedRouter);

export default router;