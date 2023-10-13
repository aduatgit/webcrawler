const { JSDOM } = require('jsdom')


async function crawlPage(currentURL){
    // fetch and parse the html of the currentURL
    console.log(`crawling ${currentURL}`)
    try {
      const resp = await fetch(currentURL)
      if (resp.status > 399){
        console.log(`Got HTTP error, status code: ${resp.status}`)
        return
      }
      const contentType = resp.headers.get('content-type')
      if (!contentType.includes('text/html')){
        console.log(`Got non-html response: ${contentType}`)
        return
      }
      console.log(await resp.text())
    } catch (err){
      console.log(err.message)
    }
  }

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
    getURLsFromHTML,
    crawlPage
  }
  