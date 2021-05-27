#!/usr/bin/env node

 import {Release} from "./release/release";

import {Command} from "commander";
import {getRepoConfig} from "./release/config/config"; // (normal include)



(async () => {
 const command = new Command();

 command
     .description('An application for generate release')
     .requiredOption('-t, --token <token>', 'Token')
     .requiredOption('-n, --name <name>', 'Release name')
     .requiredOption('-b, --branch <branch>', 'Release base')
     .option('-c','--changelog', 'Create changelog ')
 command.parse();

 const options = command.opts();

 const release = new Release(options);
 let config
 try {
  config = await getRepoConfig()
 }catch(err){
  console.log(err)
 }

 const releaseconfig = await release.loadGitConfig(config)
 release.create(releaseconfig)
})()

