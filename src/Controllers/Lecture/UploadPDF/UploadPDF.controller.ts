import Lecture from '@/Models/Lecture';
import { sendResponse } from '@/utils/Response';
import { upload } from '@/utils/UploadS3';
import { Request, Response } from 'express';

const UploadPDF = async (req: Request, res: Response) => {
	try {
		const { lectureId } = req.params;
		const file = req.file as Express.Multer.File;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return sendResponse({
        res,
        status: 404,
        message: "Lecture Not Found"

      })
    }
    const url = await upload(file.path, `${lecture.batchId}/${lectureId}/${lectureId}.pdf`);
    return sendResponse({
      res,
      status: 200,
      data: {
        url
      }
    })
  } catch (error) {
    console.log(error);
    return sendResponse({
      res,
      status: 500,
      message: "Internal Server Error"
    })
  }
};

export default UploadPDF;
