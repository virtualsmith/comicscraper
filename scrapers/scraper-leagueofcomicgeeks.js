const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const request = require('request');
const os = require('os');

const imageDir = "data/images";
const lcgDirCatalog = "data/LeagueOfComicGeeks/WeeklyLists"
const lcgDirSeries = "data/LeagueOfComicGeeks/Comics"


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
            
    }//*[@id="comic-list-issues"]/li[1]

    const browser = await puppeteer.launch(browserOpts);
    
    const page = await browser.newPage();
    await page.goto(url);
    //await page.click('#btnShowTable');
    await page.waitFor(1000);

    console.log(`LCGScraper:scrapeWeeklyListPage: Went to ${url}`);
    let weekDate = await getValue(page, '//*[@id="date_release_week"]', 'value');

    console.log("weekdate: " + weekDate);

    // let listIssues = await page.evaluate(() => {

    //     let issuesBlock = document.body.querySelectorAll('//*[@id="comic-list-issues"]');
    //     let quotes = Object.values(quotesElement).map(x => {
    //         return {
    //             author: x.querySelector('.author').textContent ?? null,
    //             quote: x.querySelector('.content').textContent ?? null,
    //             tag: x.querySelector('.tag').textContent ?? null,

    //         }
    //     });


    // await page.evaluate(() => 
    //    Array.from(document.querySelectorAll('//*[@id="comic-list-issues"]/li'), 
    //    console.log(e)));

    //let listBlock = await page.$x('//*[@id="comic-list-issues"]');//await getValue(page, '//*[@id="comic-list-issues"]');
    //console.log("listBlock: " + listBlock);
    
    // let [stuff] = await page.$x('//*[@id="comic-list-issues"]');
    // console.log(stuff);
console.log("1");
    const listIssues = await page.evaluate(() => {
        const lis = Array.from(document.querySelectorAll('ul[id="comic-list-issues"]'));
        console.log("lis: " + lis);
        return lis.map(li => {
            console.log("..in..");
            let issueName = li.querySelector("div.title").a;
            let issueUrl = li.querySelector("div.title").a;
            let issueDate ="";//  = li.querySelector("div[5]/span[1]").innerText.trim();
            console.log("Found: issue(" + issueName + ", " + issueDate + ": " + issueUrl +")");
           return { issueName: issueName, issueUrl: issueUrl, issueDate: issueDate};
        });
    });
    console.log("2");

    console.log("list:" + listIssues);

    browser.close();

    var listLength = Object.keys(listIssues).length;

    return ({weekDate, listIssues});
}

module.exports = { scrapeWeeklyListPage };
