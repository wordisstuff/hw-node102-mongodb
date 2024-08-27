import fs from 'node:fs/promises';
import path from 'node:path';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/constants.js';
import { authDb, tps } from '../constants/index.js';

const saveFileToUploads = async file => {
    await fs.rename(
        path.join(TEMP_UPLOAD_DIR, file.filename),
        path.join(UPLOAD_DIR, file.filename),
    );
    return `${tps.domain}${authDb.port}/uploads/${file.filename}`;
};
export default saveFileToUploads;
