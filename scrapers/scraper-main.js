const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const request = require('request');
const os = require('os');
const ScraperPreviewsWorld = require('./scraper-previewsworld');
const ScraperLeagueOfComicGeeks = require('./scraper-leagueofcomicgeeks');


const imageDir = "data/images";
const previewsWorldDirCatalog = "data/PreviewsWorld/Catalog";
const previewsWorldDirSeries = "data/PreviewsWorld/Series";
const shortboxedDir = "data/Shortboxed";
const locgDirWeekly = "data/LeagueOfComicGeeks/Weekly";
const locgDirIssues = "data/LeagueOfComicGeeks/Issues";

function pad(n) {
    return n<10 ? '0'+n : n
}


async function scrapePreviewWorldFromList(comicListing) {
    //console.log("scraper-main.scrapePreviewWorldFromList: List:" + comicListing.length + " comics");

    var results = "";
    var skippedNum = 0;
    var loadedNum = 0;

    for (let x = 0; x < comicListing.length; x++) {
        var comic = comicListing[x];
        var filename = "" + previewsWorldDirCatalog + "/" + comic.getId() + ".json";

        //console.log("scraper-main.scrapePreviewWorldFromList: working:" + comic.getId() + " file(" + filename + ")");
        if (fs.existsSync(filename)) {
            //console.log("scraper-main.scrapePreviewWorldFromList: file(" + filename + ") exists.  Skipping.");
            console.log("Comic: " + comic.getId() + " skipped.");
            skippedNum++;
        } else {
            await scrapePreviewsWorldWithId(comic.getId(), filename);
            console.log("Comic: " + comic.getId() + " saved.");
            loadedNum++;
        }
        results += comic.getId() + ",";
  
    }
  
    return "Completed. Loaded : " + loadedNum + ". Skipped : " + skippedNum + ".";
    
}

async function scrapePreviewsWorld(url, id, seriesId) {
    var responseData = "";
    
    var scrapeUrl = "";
    var filename = "";

    if (url != undefined) {
        scrapeUrl = url;
        filename = filename + previewsWorldDirCatalog + "/" + path.basename(scrapeUrl) + ".json";
        //console.log("scraper-main.scrapePreviewsWorld: Scraping Url.");
        responseData = await ScraperPreviewsWorld.scrapeCatalogPage(scrapeUrl);

    } 
    else if (id != undefined) {
        scrapeUrl = "https://www.previewsworld.com/Catalog/" + id;
        filename = filename + previewsWorldDirCatalog + "/" + id + ".json";
        //console.log("scraper-main.scrapePreviewsWorld: Scraping Id(" + id + ")");
        responseData = await ScraperPreviewsWorld.scrapeCatalogPage(scrapeUrl);
    }
    else if (seriesId != undefined) {
        scrapeUrl = "https://www.previewsworld.com/Catalog/Series/" + seriesId;
        filename = filename + previewsWorldDirSeries + "/" + seriesId + ".json";
        //console.log("scraper-main.scrapePreviewsWorld: Scraping seriesId(" + seriesId + ")");
        responseData = await ScraperPreviewsWorld.scrapeSeriesPage(scrapeUrl);
    }


    try {
        //console.log(filename);
        fs.writeFileSync(filename, JSON.stringify(responseData))
      } catch (err) {
        console.error(err)
      }
    
    //console.log("scraper-main.scrapePreviewsWorld: Working Url:" + scrapeUrl);
    //return responseData;
    return "Data written to " + filename + "\n";
}

async function scrapePreviewsWorldWithId(id, filename) {
    //console.log("scraper-main.scrapePreviewsWorldWithIdId(" + id + "): In ");

    var scrapeUrl = "";
    // var filename = "";

    scrapeUrl = "https://www.previewsworld.com/Catalog/" + id;
    //console.log("scraper-main.scrapePreviewsWorldWithId: Scraping Id(" + id + ")");
    responseData = await ScraperPreviewsWorld.scrapeCatalogPage(scrapeUrl);

    try {
        //console.log(filename);
        fs.writeFileSync(filename, JSON.stringify(responseData));
    } catch (err) {
        console.error(err);
        return "";
    }

    //console.log("scraper-main.scrapePreviewsWorldWithId(" + id + "): Finished");

    return "Data written to " + filename + "\n";
}

async function scrapeLeagueOfComicGeeksWeeklyList() {
    console.log("scraper-main.scrapeLeagueOfComicGeeksWeeklyList(): In ");

    var scrapeUrl = "";
    var filename = "" + locgDirWeekly + "/";

    responseData = await ScraperLeagueOfComicGeeks.scrapeWeeklyListPage("https://leagueofcomicgeeks.com/comics/new-comics");

    const weekDate = new Date(responseData.weekDate);
    const weekString = "" + weekDate.getFullYear() + "-" + pad(weekDate.getMonth() + 1) + "-" + pad(weekDate.getDate());
    
    try {
        filename = filename + weekString + ".json";
        console.log(filename);
        fs.writeFileSync(filename, JSON.stringify(responseData.listIssues));
    } catch (err) {
        console.error(err);
        return "";
    }

    return "Data written to " + filename + "\n";
}

module.exports = { scrapePreviewWorldFromList, scrapePreviewsWorld, scrapePreviewsWorldWithId, scrapeLeagueOfComicGeeksWeeklyList };
