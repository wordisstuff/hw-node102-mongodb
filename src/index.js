import { TEMP_UPLOAD_DIR } from './constants/constants.js';
import { initMongoDB } from './db/initMongoDB.js';
import { setupServer } from './server.js';
import createDir from './utils/createDir.js';

const bootstrap = async () => {
    await initMongoDB();
    await createDir(TEMP_UPLOAD_DIR);
    setupServer();
};

bootstrap();
