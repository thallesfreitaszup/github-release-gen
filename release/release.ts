import { getRepoConfig } from './config/config';
import {release, type} from "os";


export class  Release {
    private options
    private releaseConfig
    constructor(options) {
        this.options = {
            token: options.token,
            releaseName: options.name,
        }
    }
    async loadGitConfig(repoConfig) {
        console.log(repoConfig)
        if(!repoConfig.length){
            throw Error('could not load repo config')
        }
        console.log(repoConfig[0].split('\n'))
        this.releaseConfig = {...repoConfig, ...this.options }
        return this.releaseConfig
    }

    create(config: any) {
        //TODO
    }
}