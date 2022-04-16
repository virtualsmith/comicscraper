const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const request = require('request');
const os = require('os');

const imageDir = "data/images";
const previewsWorldDirCatalog = "data/PreviewsWorld/Catalog"
const previewsWorldDirSeries = "data/PreviewsWorld/Series"
const shortboxedDir = "data/Shortboxed"


async function getValue(page, xpath, valuetype='textContent') {
    var itemTxt = "";
    let [el] = await page.$x(xpath);
    if (el != undefined) {
        let item = await el.getProperty(valuetype);
        if (item != undefined) {
            itemTxt = await item.jsonValue();
        } else {
            itemTxt = "{Not Found}";
        }
    } else {
        itemTxt = "{Not Found}";
    }


    return itemTxt;
}

function downloadImage(url, id, location) {
    let writelocation = `${location}/${id}.jpg`;
    request.head(url, (err, res, body) => {
        var writeStream = fs.createWriteStream(writelocation);
        writeStream.on('error', (err) => {
            console.log('Error in write stream, probably didn\'t write the image');
        });
    
        request(url)
          .pipe(writeStream);
    });
    
    //console.log(url + " downloaded");
    return writelocation;
  
}

async function scrapeCatalogPage(url) {
    let issueUrl = url;
    let issueId  = url.substring(url.lastIndexOf("/")+1);
 
    //console.log(`ScraperPreviewsWorld:scrapeCatalogPage: (${url})`);

    let browserOpts;
    if ((os.release().includes('Microsoft')) || process.platform == "win32") {
        //console.log("Win32 detected: setting Win Options");
        browserOpts = {
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
           ],
        };
            
    }

//*[@id="PageContent"]/div[1]/div[4]/text()[4]
    const browser = await puppeteer.launch(browserOpts);

    const page = await browser.newPage();
    await page.goto(url);
    //console.log(page);

    let image = await getValue(page, '//*[@id="MainContentImage"]', 'src');
    let title = await getValue(page, '//*[@id="PageContent"]/div[1]/h1');
    let publisher = await getValue(page, '//*[@id="PageContent"]/div[1]/div[1]');
    let id = await getValue(page, '//*[@id="PageContent"]/div[1]/div[4]/div[1]');
    let creators = await getValue(page, '//*[@id="PageContent"]/div[1]/div[4]/div[2]/text()');
    let desc = await getValue(page, '//*[@id="PageContent"]/div[1]/div[4]');
    let release = await getValue(page, '//*[@id="PageContent"]/div[1]/div[4]/div[3]');
    let price = await getValue(page, '//*[@id="PageContent"]/div[1]/div[4]/div[4]');
    let seriesUrl = await getValue(page, '//*[@id="PageContent"]/div[1]/div[4]/a', 'href');

    if (title == "{Not Found}" || id == "{Not Found}") {
        browser.close();
        return ({});
    }

    desc = desc.substring(
        (desc.indexOf(creators)+creators.length),
        (desc.indexOf(release))
    );

    creators = creators.replace(/ {1,}/g," ");
    creators = creators.trim();
    desc = desc.trim();
    var seriesId = "";
    if (seriesUrl.lastIndexOf("/") > 1)
    {
        seriesId=seriesUrl.substring(seriesUrl.lastIndexOf("/")+1);
        //console.log("SeriesId: " + seriesId);
    }

    let imagelocation = downloadImage(image, id, imageDir);

    browser.close();
    //console.log("creators =" + creators);
    //console.log("desc =" + desc);
    //console.log(`Image(${image}), title(${title}), publisher(${publisher}), id(${id}), creators(${creators}), creators(${creators}), `);
    
    return ({ issueUrl, issueId, image, title, publisher, id, creators, desc, release, price, seriesUrl, seriesId, imagelocation });

}


async function scrapeSeriesPage(url) {
    let seriesUrl = url;
    let seriesId  = url.substring(url.lastIndexOf("/")+1);

    let browserOpts;
    if ((os.release().includes('Microsoft')) || process.platform == "win32") {
        //console.log("Win32 detected: setting Win Options");
        browserOpts = {
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
           ],
        };
            
    }

    const browser = await puppeteer.launch(browserOpts);
    
    const page = await browser.newPage();
    await page.goto(url);
    //await page.click('#btnShowTable');
    await page.waitFor(1000);

    //console.log(`Scrapers:scrapeSeriesPage: Went to ${url}`);
    let seriesTitle = await getValue(page, '//*[@id="PageContent"]/div[1]/div[1]/div[2]');
    let publisher = await getValue(page, '//*[@id="PageContent"]/div[1]/div[1]/div[3]');
    if (seriesTitle.startsWith("SERIES: ")) {
        seriesTitle = seriesTitle.substr(("SERIES: ").length);
    }

    //console.log({ listingTitle, publisher});

    const seriesIssues = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('td.dmdNo'))
        return tds.map(td => {
            let issueNum = td.querySelector("div.dmdNoIssueNo").innerText.trim();
            let issueId  = td.querySelector("a").innerText.trim();
           return { issueNum: issueNum, issueId: issueId};
        });
    });

    //console.log(seriesIssues);

    browser.close();

    var listLength = Object.keys(seriesIssues).length;

    return ({seriesUrl, seriesId, seriesTitle, publisher, seriesIssues});
}

module.exports = { scrapeCatalogPage, scrapeSeriesPage };
