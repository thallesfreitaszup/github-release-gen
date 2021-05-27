import {AppConstants} from "../config/constants";

export const makeGitUrlRequest = (repo, owner, path) => {
    return `${AppConstants.BASE_URL}/repos/${owner}/${repo}/${path}`
}
export const appendParamUrl = (url, paramName, paramValue) => {
    return `${url}?${paramName}=${paramValue}`
}
