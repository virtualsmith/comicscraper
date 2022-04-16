const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
var dateFormat = import('dateformat');
const http = require('http');
const url = require('url');

const fs = require('fs');

const app = express();
const router = express.Router();
const port = process.env.PORT || "3030";

const ScraperMain = require('./scrapers/scraper-main');
const LoadJson = require('./loadjson');
const ComicData = require('./model/comic-data');

const imageDir = "data/images";
const previewsWorldDirCatalog = "data/PreviewsWorld/Catalog"
const previewsWorldDirSeries = "data/PreviewsWorld/Series"
const shortboxedDir = "data/Shortboxed"

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Routes Definitions
 */
router.route('/').get(function (req, res) {
  console.log("in root:/");
  res.status(200).send('Hello World!');
  // res.status(200).render('index.html', 
  // {
  //     // parameter1:value1, 
  //     // parameter2:value2
  // });
});

router.route('/scrapePreviewsWorld').get(async function (req, res) {

  //console.log("ComicScraper:/scrapePreviewsWorld");
  let results = await ScraperMain.scrapePreviewsWorld(req.query.url, req.query.id, req.query.seriesId);

  //console.log("ComicScraper:/scrapePreviewsWorld - Results:" + results);

  res.status(200).send(results);
});

router.route('/scrapePreviewsWorldFromShortboxedData').get(async function (req, res) {

  //console.log("ComicScraper:/scrapePreviewsWorldFromShortboxedData");
  //let results = await ScraperMain.scrapePreviewsWorld(req.query.week);
  var filename = shortboxedDir + "/" + req.query.week + ".json";
  var results = "";
  if (fs.existsSync(filename)) {
    LoadJson.clearData();
    var comicListing = LoadJson.loadJson(filename);

    // await.ScraperMain.

    // var comicListingKeys = Object.keys(comicListing);
    // comicListingKeys.forEach(async function(comicKey) {
    //     var comic = comicListing[comicKey];// ComicData.class(comicListing[comicKey]);
    //     console.log(comic.getId());
    //     await ScraperMain.scrapePreviewsWorldTest(null, comic.getId(), null);
    //     results += comic.getId() + ",";
    //     //console.log("Gonna call parse on" + comic.diamond_id);
    // });

    // var processComic = async function(comicKey){
    //   if( comicKey < comicListing.length ) {
    //     var comic = comicListing[comicKey];
    //     await ScraperMain.scrapePreviewsWorldWithId(comic.getId(), async function(res) {
    //       console.log("In responsefunc from " + comic.getId());
    //       results += comic.getId() + ",";
    
    //       await processComic(comicKey+1);
    //     });
    //   }
    // };
    
    // await processComic(0);

    // async function processComics() {

    // }
    // processComics().then( data => console.log(data) );  

    // for (let x = 0; x < comicListing.length; x++) {
    //   var comic = comicListing[x];
    //   console.log(comic.getId());
    //   await ScraperMain.scrapePreviewsWorldWithId(comic.getId());
    //   results += comic.getId() + ",";

    // }
  console.log("Scraping PreviewWorld with list from " + req.query.week + ", working " + comicListing.length + " comics.");

    results = await ScraperMain.scrapePreviewWorldFromList(comicListing);

  } else {
    results = "Error: No file at (" + filename + ") exists."
  }

  console.log("ComicScraper:/scrapePreviewsWorldFromShortboxedData - Results:" + results);

  res.status(200).send(results);
});

router.route('/loadAllData').get(async function (req, res) {
  console.log("ComicScraper:/loadAllData");
  //console.log("ComicScraper:/loadData : loading from ./data");

  fs.readdirSync('./data').forEach(file => {
    LoadJson.loadJson('./data/' + file);
  });
  
  res.status(200).send(LoadJson.dumpCSV());

});
   
app.use('/', router);
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});