#!/usr/bin/env node

 const { Command } = require('commander'); // (normal include)
const command = new Command();

command
    .description('An application for generate release')
    .requiredOption('-t, --token <token>', 'Token')
    .requiredOption('-n, --name <name>', 'Release name')
    .requiredOption('-b, --branch <branch', 'Release base')
command.parse();

const options = command.opts();

const release = new Release(options)