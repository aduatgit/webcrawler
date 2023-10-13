const { JSDOM } = require('jsdom')


const normalizeURL = (url) => {
    const oldURL = new URL(url)
    if (oldURL.pathname.lastIndexOf('/') === oldURL.pathname.length - 1){
        oldURL.pathname = oldURL.pathname.slice(0, -1)
    }
    return oldURL.hostname + oldURL.pathname
}

const getURLsFromHTML = (htmlBody, baseURL) => {
    const URLs = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window._document.querySelectorAll('a')
    for (const aElement of aElements) {
        if (aElement.href.slice(0,1) === '/') {
            try {
                URLs.push(new URL(aElement.href, baseURL).href)
            } catch (error) {
                console.log(`${err.message}: ${aElement.href}`)
            }
        } else {
            try {
                URLs.push(new URL(aElement.href).href)
            } catch (error) {
                console.log(`${err.message}: ${aElement.href}`)
            }
        }
    }
    return URLs
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
  }
  