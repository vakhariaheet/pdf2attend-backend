import AddLecture from "@/Controllers/Lecture/AddLecture/AddLecture.controller";
import GetAllLecture from "@/Controllers/Lecture/GetAllLecture/GetAllLecture.controller";
import GetAllLectureValidate from "@/Controllers/Lecture/GetAllLecture/GetAllLecture.validator";
import GetFilters from "@/Controllers/Lecture/GetFilters/GetFilters.controller";
import GetUnverifiedAttendence from "@/Controllers/Lecture/GetUnverifiedAttendence/GetUnverifiedAttendence.controller";
import GetUnverifiedAttendenceValidate from "@/Controllers/Lecture/GetUnverifiedAttendence/GetUnverifiedAttendence.validator";
import UploadPDF from "@/Controllers/Lecture/UploadPDF/UploadPDF.controller";
import UploadPDFValidate from "@/Controllers/Lecture/UploadPDF/UploadPDF.validator";
import VerifyLecture from "@/Controllers/Lecture/VerifyLecture/VerifyLecture.controller";
import VerifyLectureValidate from "@/Controllers/Lecture/VerifyLecture/VerifyLecture.validator";
import VerifyToken from "@/Middleware/VerifyToken";
import { Router } from "express";
import multer from 'multer';

const upload = multer({
    dest: 'files/',
    limits: {
        fileSize: 1024 * 1024 * 50,
        
    }
});


const router = Router();
const protectedRouter = Router();
protectedRouter.use(VerifyToken);
protectedRouter.get('/:lectureId/unverified', GetUnverifiedAttendenceValidate, GetUnverifiedAttendence)
protectedRouter.post('/:lectureId/verify', VerifyLectureValidate, VerifyLecture);
protectedRouter.get('/', GetAllLecture);
protectedRouter.post('/', AddLecture);
protectedRouter.post('/:lectureId/upload', upload.single("file"), UploadPDFValidate, UploadPDF)
protectedRouter.get('/get-filters', GetFilters);
router.use("/", protectedRouter);


export default router;