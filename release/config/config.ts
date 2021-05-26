import { AppConstants } from "./constants";

import { spawn } from 'child_process'

export const getRepoConfig = async () => {
    return new Promise((resolve,reject)=> {
        const repoData = []
        const pipe = spawn(AppConstants.GIT_LIST_COMMAND, ['--list'], {shell: true}).
        on('error', function( err ){ console.log(err) })
        pipe.stdout.on('data', data => {
            repoData.push(Buffer.from(data).toString('utf-8'))
        })
        pipe.stdout.on('error', err => {
            console.error('error: ',err)
             reject(err)
        })
        pipe.stdout.on('close',(code) => {
            resolve(repoData)
        })
    })
}
