import kue from 'kue';
import find from 'find';

const FILES_PATH = process.env.FILES_PATH || '/data';
const redis = {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1'
};
const queue = kue.createQueue({
    redis
});

function getFiles(path, cb) {
    find.file(path, (files) => {
        cb(files.filter(file => (!(/(^|\/)\.[^\/\.]/g).test(file))));
    });
}

getFiles(FILES_PATH, files => {
    files.forEach(file => {
        console.log('Creating job for: ' + file);
        queue.create('index', {
            file
        }).removeOnComplete(true).save();
    });
});
