import fs from 'node:fs/promises';

const createDir = async url => {
    try {
        await fs.access(url);
    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.mkdir(url);
        }
    }
};
export default createDir;
