export const  formatPr = (pr) => {
    console.log(pr)
    return `- [#${pr.number}](${pr.url}) ${pr.title} `

}

export const formatRelease = (pullRequests) => {
    return pullRequests.map(
        pr => formatPr(pr)
    ).toString()
}