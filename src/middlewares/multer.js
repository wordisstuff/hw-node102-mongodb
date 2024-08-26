import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/constants.js';

const storege = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Math.round(Math.random() * 1e9) + '-' + file.originalname);
    },
});

const uploader = multer({ storege });
export default uploader;
