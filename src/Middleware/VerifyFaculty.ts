import { sendResponse } from "@/utils/Response";
import { NextFunction, Request, Response } from "express";

const VerifyFaculty = async (req: Request, res: Response, next: NextFunction) => { 
    const { role } = req.body;
    if (role === "faculty") {
        next();
    } else {
        return sendResponse({
            res,
            status: 403,
        })
    }
}

export default VerifyFaculty;