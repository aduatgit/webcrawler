const { JSDOM } = require('jsdom')


async function crawlPage(baseURL, currentURL, pages){
    // fetch and parse the html of the currentURL
    const baseObj = new URL(baseURL);
    const currObj = new URL(currentURL);
    if (baseObj.hostname !== currObj.hostname) {
        return pages
    }

    const currNorm = normalizeURL(currentURL)

    if (pages[currNorm] > 0) {
        pages[currNorm]++
        return pages
    }

    if (baseURL === currentURL) {
        pages[currNorm] = 0
    } else {
        pages[currNorm] = 1
    }

    console.log(`crawling ${currentURL}`)
    let htmlBody = ''

    try {
      const resp = await fetch(currentURL)
      if (resp.status > 399){
        console.log(`Got HTTP error, status code: ${resp.status}`)
        return pages
      }
      const contentType = resp.headers.get('content-type')
      if (!contentType.includes('text/html')){
        console.log(`Got non-html response: ${contentType}`)
        return pages
      }
      htmlBody = await resp.text()
    } catch (err){
      console.log(err.message)
    }

    const nextURLs = getURLsFromHTML(htmlBody, baseURL)
    for (const nextURL of nextURLs){
      pages = await crawlPage(baseURL, nextURL, pages)
    }
  
    return pages
    
  }

  function normalizeURL(url){
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
      fullPath = fullPath.slice(0, -1)
    }
    return fullPath
  }

function getURLsFromHTML(htmlBody, baseURL){
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
  