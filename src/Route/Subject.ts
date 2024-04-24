import AddCourse from "@/Controllers/Subject/AddCourse/AddCourse.controller";
import AddCourseValidate from "@/Controllers/Subject/AddCourse/AddCourse.validator";
import AddSubject from "@/Controllers/Subject/AddSubject/AddSubject.controller";
import AddSubjectValidate from "@/Controllers/Subject/AddSubject/AddSubject.validator";
import GetCourses from "@/Controllers/Subject/GetCourses/GetCourses.controller";
import GetCoursesValidate from "@/Controllers/Subject/GetCourses/GetCourses.validator";
import GetSubjects from "@/Controllers/Subject/GetSubjects/GetSubjects.controller";
import GetSubjectsValidate from "@/Controllers/Subject/GetSubjects/GetSubjects.validator";
import UpdateSubject from "@/Controllers/Subject/UpdateSubject/UpdateSubject.controller";
import UpdateSubjectValidate from "@/Controllers/Subject/UpdateSubject/UpdateSubject.validator";
import VerifyAdmin from "@/Middleware/VerifyAdmin";
import VerifyToken from "@/Middleware/VerifyToken";
import { Router } from "express";

const router = Router();
router.use(VerifyToken);
router.use(VerifyAdmin);

router.post('/add-subject', AddSubjectValidate, AddSubject);
router.post('/add-course', AddCourseValidate, AddCourse);
router.get('/courses',GetCoursesValidate, GetCourses)
router.get('/', GetSubjectsValidate, GetSubjects);
router.put('/:id', UpdateSubject, UpdateSubjectValidate);
export default router;