import kue from 'kue';
import find from 'find';
import chokidar from 'chokidar';

function getFiles(path, cb) {
    find.file(path, (files) => {
        cb(files.filter(file => (!(/(^|\/)\.[^\/\.]/g).test(file))));
    });
}

export default class Controller {
    constructor(host, port) {
        const redis = {
            port: process.env.REDIS_PORT || 6379,
            host: process.env.REDIS_HOST || '127.0.0.1'
        };
        this.queue = kue.createQueue({
            redis
        });
        this.watcher = chokidar.watch(undefined, {
            ignored: /(^|\/)\.[^\/\.]/g
        });
        this.watcher.on('add', this.indexFile);
        this.watcher.on('change', this.indexFile);
        this.watcher.on('unlink', this.deleteFile);
        this.index = this.index.bind(this);
        this.indexFile = this.indexFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.watch = this.watch.bind(this);
    }
    watch(path) {
        this.watcher.add(path);
    }
    indexFile(file) {
        console.log('Creating index job for: ' + file);
        this.queue.create('index', {
            file
        }).removeOnComplete(true).save();
    }
    deleteFile(file) {
        console.log('Creating delete job for: ' + file);
        this.queue.create('delete', {
            file
        }).removeOnComplete(true).save();
    }
    index(path) {
        getFiles(path, files => {
            files.forEach(file => {
                console.log('Creating job for: ' + file);
                this.queue.create('index', {
                    file
                }).removeOnComplete(true).save();
            });
        });
    }
}
