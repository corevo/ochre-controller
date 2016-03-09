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

find.file(/^((?!\/\.).)*$/, FILES_PATH, (files) => {
    files.forEach(file => {
        console.log(file);
    });
    //queue.create().removeOnComplete(true).save();
});
