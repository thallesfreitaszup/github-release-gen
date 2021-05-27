
import {AppConstants} from "./config/constants";
import {get, post} from "./utils/http";
import {appendParamUrl, makeGitUrlRequest} from "./utils/url";

export class  Release {
    private options
    private releaseConfig
    constructor(options) {
        this.options = {
            token: options.token,
            releaseName: options.name,
        }
    }
    async loadGitConfig(gitConfig) {
        console.log(gitConfig)
        if(!gitConfig.length){
            throw Error('could not load repo config')
        }
        const arrayConfig: Array<String> = gitConfig[0].split('\n')
        const repoConfig = arrayConfig.filter(
            config => config.includes(AppConstants.EMAIL_CONFIG) || config.includes(AppConstants.URL_CONFIG)
        )
        let configObject = this.configToObject(repoConfig)
        this.releaseConfig = {...configObject, ...this.options }
        return this.releaseConfig
    }

    async create(config: any) {
        const releases = await this.getLatestRelease()
        const mergedPullRequests = await this.getMergedPullRequests()
        console.log(mergedPullRequests)
        // createRelease()
        //TODO
    }

    private async getMergedPullRequests() {
        const url = makeGitUrlRequest(this.releaseConfig.repo,this.releaseConfig.owner, 'pulls')
        const urlWithParams  = appendParamUrl(url, 'state', 'closed')
        return await get(urlWithParams)
    }

    private async getLatestRelease() {
        const url = makeGitUrlRequest(this.releaseConfig.repo,this.releaseConfig.owner, 'releases')
        const releases = await get(url)
        return releases
    }

    private configToObject(repoConfig: String[]) {
        const email = repoConfig[0].split('=')[1]
        const owner = repoConfig[1].split('=')[1].split('/')[3]
        const repo = repoConfig[1].split('=')[1].split('/')[4].split('.')[0]
        const object = {
            email,
            owner,
            repo
        }
        return object
    }
}