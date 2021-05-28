
import {AppConstants} from "./config/constants";
import {get, post} from "./utils/http";
import {appendParamUrl, makeGitUrlRequest} from "./utils/url";
import {formatRelease} from "./utils/format";

export class  Release {
    private options
    private releaseConfig
    constructor(options) {
        this.options = {
            token: options.token,
            releaseName: options.name,
            branch: options.branch
        }
    }
    async loadGitConfig(gitConfig) {
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
        const release = await this.getLatestRelease()
        const mergedPullRequests = await this.getMergedPullRequests(release?.published_at)
        await this.createRelease(mergedPullRequests)
    }

    private async getMergedPullRequests(lastReleaseDate) {
        const url = makeGitUrlRequest(this.releaseConfig.repo,this.releaseConfig.owner, 'pulls')
        const urlWithParams  = appendParamUrl(url, 'state', 'closed')
        const closedPrs = await get(urlWithParams)
        const mergedPrsFromBranch =  closedPrs.filter(
            pr => this.canBeOnRelease(pr,lastReleaseDate)
        )
        return mergedPrsFromBranch.map(
            it => {
                return {
                    title: it.title,
                    body: it.body,
                    url: it.html_url,
                    number: it.number
                }
            }
        )
    }

    private canBeOnRelease(pr, lastReleaseDate) {
        return pr.merged_at != null && pr.base.ref === this.releaseConfig.branch && pr.merged_at > lastReleaseDate
    }

    private async getLatestRelease() {
        const url = makeGitUrlRequest(this.releaseConfig.repo,this.releaseConfig.owner, 'releases')
        const releases = await get(url)
        return releases.length ? releases[0] : null
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

    private async createRelease(mergedPullRequests: any) {
        const url = makeGitUrlRequest(this.releaseConfig.repo,this.releaseConfig.owner, 'releases')
        const releaseBody = {
            body: formatRelease(mergedPullRequests),
            name: this.releaseConfig.releaseName,
            tag_name: this.releaseConfig.releaseName
        }
        const headers = {
            'Authorization': `token ${this.releaseConfig.token}`
        }
        const response = await post(url, releaseBody, headers)
    }
}