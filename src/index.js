import kue from 'kue';
import find from 'find';

function getFiles(path, cb) {
    find.file(path, (files) => {
        cb(files.filter(file => (!(/(^|\/)\.[^\/\.]/g).test(file))));
    });
}

export default class Controller {
    constructor(host, port, path) {
        super();
        const redis = {
            port: process.env.REDIS_PORT || 6379,
            host: process.env.REDIS_HOST || '127.0.0.1'
        };
        this.queue = kue.createQueue({
            redis
        });
    }
    index() {
        getFiles(FILES_PATH, files => {
            files.forEach(file => {
                console.log('Creating job for: ' + file);
                queue.create('index', {
                    file
                }).removeOnComplete(true).save();
            });
        });
    }
}
