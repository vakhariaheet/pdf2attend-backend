import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/Response";

const LoginValidate = (req: Request, res: Response, next: NextFunction) => { 
    const { username, password } = req.body;
    if (username && password) {
        next();
    } else {
        return sendResponse({
            res,
            message: "Invalid Credentials",
            status: 400,
       })
    }

}

export default LoginValidate;