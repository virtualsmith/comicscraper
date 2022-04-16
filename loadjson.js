'use strict';

var comicListing  = new Array();

const fs = require('fs');
const ComicData = require('./model/comic-data');

function loadFromDir(jsonDirectory) {
    console.log("loadFromDir(" + jsonDirectory + ")");

}
// this.title =title;
// this.publisher =publisher;
// this.description =description;
// this.price =price;
// this.creators =creators;
// this.release_date =release_date;
// this.diamond_id =diamond_id;

function clearData() {
    comicListing  = new Array();
}

function loadJson(jsonFile) {
    //console.log("loadJson(" + jsonFile + ")");
    let rawdata = fs.readFileSync(jsonFile);
    let rawcomicdata = JSON.parse(rawdata);
    //console.log(rawcomicdata);

    var comiclist = rawcomicdata.comics;
    var comicKeys = Object.keys(comiclist);

    comicKeys.forEach(function(comicKey) {
        var comic = comiclist[comicKey];
        // console.log(comicKey + "," + comic);
        // console.log("Comic: " + comic.title + " , Publisher: " + comic.publisher );
        const comicItem = new ComicData(jsonFile, 
            comicKey, 
            comic.title, 
            comic.publisher,
            comic.description,
            comic.price,
            comic.creators,
            comic.release_date,
            comic.diamond_id);
        comicListing.push(comicItem);
        //console.log("Loaded: " + comicItem.toString());
    });
    
    //console.log("loadJson(" + jsonFile + ").  Added : " + comicListing.length);

    return comicListing;
}

function dumpCSV() {
    console.log("dumpCSV(). Total Comics : " + comicListing.length);

    var outString = "";
    var printHeader = true;
    var comicListingKeys = Object.keys(comicListing);
    comicListingKeys.forEach(function(comicKey) {
        var comic = comicListing[comicKey];
        outString += comic.toCSV(printHeader);
        printHeader = false;
    });

    return outString;
}

module.exports = { clearData, loadFromDir, loadJson, dumpCSV };
