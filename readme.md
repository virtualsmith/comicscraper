
# ComicScraper API

The REST API to the example app is described below.

## Root status

### Request

`GET /`

    curl -i -H 'Accept: application/json' curl localhost:3030/

### Response

    []

## Scrape Previews World site

This scrapes data from the PreviewsWorld website, gets comic data, then saves it off to a file in /data/PreviewsWorld/Catalog or /data/PreviewsWorld/Series
https://www.previewsworld.com/Catalog/MAY190690
https://www.previewsworld.com/Catalog/Series/142143-HOUSE-OF-X

### Request

`GET /scrapePreviewsWorld`

*  **URL Params**

   **Optional:**
 
   `url=[full PreviewsWorld URL]`

   **Optional:**
 
   `id=[diamond Id]`

   **Optional:**
 
   `seriesId=[series Id]`

## Scrape Previews World using Shortboxed Data

Meant to be called with a week parameter that cooresponds with a data file in the /data/Shortboxed directory.  It will then parse each item in that file and scrape PreviewsWorld for each

### Request

`GET /scrapePreviewsWorldFromShortboxedData`

*  **URL Params**

   **Required:**
 
   `week=[YYYY-MM-DD]`

## Load All Data

Load all data from the /data/Shortboxed directory. 

### Request

`GET /loadAllData`

*  **URL Params**

   **None**
 











Tutorials that helped with some of the concepts:
* https://levelup.gitconnected.com/stop-using-a-starter-node-js-project-and-build-your-own-38a97aa723f9
* https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/
* https://thinkster.io/tutorials/node-json-api/initializing-a-starter-node-project

