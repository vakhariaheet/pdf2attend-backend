import { BatchWithSubject } from "@/Controllers/Lecture/GetAllLecture/GetAllLecture.controller";
import Batch from "@/Models/Batch";
import Lecture from "@/Models/Lecture"

export const getLecture = async (lectureId: string) => { 

    const lecture = await Lecture.findById(lectureId);
    const batch = await Batch.findById(lecture?.batchId).populate('subjectId').populate('facultyIds') as BatchWithSubject;
    const subject = batch?.subjectId;
    return {
        ...lecture?.toObject(),
        sem: subject?.sem,
        shift: subject?.shift,
        academicYear: subject?.academicYear,
        course: subject?.courseId.name,
        subjectName: subject?.name,
        batchName: batch?.name,
        faculties: batch?.facultyIds.map((faculty) => ({
            name: faculty.name,
            _id: faculty._id,
            username: faculty.username,
            email: faculty.email,
        })),
    }
}