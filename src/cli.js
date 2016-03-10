#!/usr/bin/env node

import program from 'commander';
//import controller from './index';

process.title = "ochre commander";

program
    .version(require('../package.json').version)
    .usage('[options] <path to index>')
    .option('-a, --address', 'Redis address, if not specified will use REDIS_HOST or localhost')
    .option('-p, --port', 'Redis port, if not specified will use REDIS_PORT or 6379')
    .parse(process.argv);

let port = program.port;
if (port === undefined) {
    port = process.env.REDIS_PORT || 6379;
}

let address = program.address;
if (address === undefined) {
    address = process.env.REDIS_HOST || '127.0.0.1';
}

console.log(program.address);
console.log(program.port);
console.log(program.args);
