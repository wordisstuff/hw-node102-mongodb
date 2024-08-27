// import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/constants.js';
import { initMongoDB } from './db/initMongoDB.js';
import { setupServer } from './server.js';
import createDirs from './utils/createDir.js';

const bootstrap = async () => {
    await initMongoDB();
    await createDirs(['temp', 'uploads']);
    setupServer();
};

bootstrap();
