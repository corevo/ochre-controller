#!/usr/bin/env node

import program from 'commander';
import Controller from './index';

process.title = "ochre commander";

program
    .version(require('../package.json').version)
    .usage('[options] <absolute path to index>')
    .option('-a, --address', 'Redis address, if not specified will use REDIS_HOST or localhost')
    .option('-p, --port', 'Redis port, if not specified will use REDIS_PORT or 6379')
    .parse(process.argv);

let port = program.port;
if (!port) {
    port = process.env.REDIS_PORT || 6379;
}

let address = program.address;
if (!address) {
    address = process.env.REDIS_HOST || '127.0.0.1';
}

let path = program.args[0];
if (!path) {
    path = process.env.FILES_PATH || '/data';
}

let controller = new Controller(address, port);
controller.index(path);
let interval = setInterval(() => {
    controller.index(path);
}, 1000*60*60*4);
