import Attendance from '@/Models/Attendance';
import Lecture from '@/Models/Lecture';
import { IStudent } from '@/Models/Student';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const VerifyLecture = async (req: Request, res: Response) => {
  try {
    const { lectureId } = req.params;
    const { studentAttendance } = req.body;

    const lecture = await Lecture.findOne({ _id: lectureId });
    const attendance = studentAttendance.map((student: IStudent & {status:string}) => ({ 
      lectureId: lecture?._id,
      studentId: student._id,
      isPresent: student.status === 'Present',
    }));
    await Attendance.insertMany(attendance);
    await Lecture.findByIdAndUpdate(lectureId, { status:'verified' });
    return sendResponse({
      res,
      status: 200,
      message: 'Attendance Marked',
    })
  } catch (error) {
    console.log(error);
    return sendResponse({
      res,
      status: 500,
      message: 'Internal Server Error',
    })
 }
};

export default VerifyLecture;