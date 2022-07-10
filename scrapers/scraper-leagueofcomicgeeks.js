const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const request = require('request');
const os = require('os');

const imageDir = "data/images";
const locgDirWeekly = "data/LeagueOfComicGeeks/Weekly";
const locgDirIssues = "data/LeagueOfComicGeeks/Issues";


async function getValue(page, xpath, valuetype='textContent') {
    var itemTxt = "";
    let [el] = await page.$x(xpath);
    console.log("el: " + el);
    if (el != undefined) {
        let item = await el.getProperty(valuetype);
        console.log("item: " + item);
        if (item != undefined) {
            itemTxt = await item.jsonValue();
        } else {
            itemTxt = "{Not Found}";
        }
    } else {
        itemTxt = "{Not Found}";
    }

console.log("itemTxt: " + itemTxt);
    return itemTxt;
}

async function scrapeWeeklyListPage(url) {
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
//    await page.goto(url);
//    await page.waitFor(1000);
    await page.goto(url, { waitUntil: "load", timeout: 0 });


    console.log(`LCGScraper:scrapeWeeklyListPage: Went to ${url}`);
    let weekDate = await getValue(page, '//*[@id="date_release_week"]', 'value');

    console.log("weekdate: " + weekDate + "\n");

    const listIssues = await page.evaluate(() => {
        //document.querySelectorAll('[id="comic-list-issues"]').length;
        const lis = Array.from(document.querySelector('[id="comic-list-issues"]').querySelectorAll('li'));
        return lis.map(li => {
            let issueNum = li.querySelector(".title").innerText.trim();
            let issueUrl = li.querySelector(".cover").querySelector("a").href;
            let issuePub = li.querySelector(".publisher").innerText.trim();
            let issueDate = li.querySelector(".details").querySelector("span").innerText.trim();
            return { issueNum: issueNum, issueUrl: issueUrl, issuePub: issuePub, issueDate: issueDate};
        });
    });
    //console.dir(listIssues);

    browser.close();
      
    return ({weekDate, listIssues});//, listIssues});
}

module.exports = { scrapeWeeklyListPage };
