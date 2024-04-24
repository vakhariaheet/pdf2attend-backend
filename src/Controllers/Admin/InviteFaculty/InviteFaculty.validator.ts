import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/Response";

const InviteFacultyValidate = (req: Request, res: Response, next: NextFunction) => { 
    const { username, name, email, role="faculty" } = req.body;
    
    if (username && name && email && role) {
        next();
    } else {
        return sendResponse({
            res,
            message: "Not all fields are filled",
            status: 400,
       })
    }

}

export default InviteFacultyValidate;
