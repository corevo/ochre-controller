import index from 'ochre-indexer';
import kue from 'kue';

const redis = {
    port: process.env.REDIS_PORT | 6379,
    host: process.env.REDIS_HOST | '127.0.0.1'
};
const queue = kue.createQueue({
    redis
});
