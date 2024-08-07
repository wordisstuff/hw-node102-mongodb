import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

const isValidId = (req,res,next)=>{
    const {id} = req.params;
    if(!isValidObjectId(id)){
        next(createHttpError(400,{status:400,message: "Invalid contact ID!!!"}))
        return;
    };
    next();
};

export default isValidId;