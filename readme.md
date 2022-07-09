
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
 






# Data Sources

## Shortboxed
* https://api.shortboxed.com/
* https://api.shortboxed.com/comics/v1/releases/available
* https://api.shortboxed.com/comics/v1/release_date/2016-02-17
* https://api.shortboxed.com/comics/v1/new

## PreviewsWorld
* https://www.previewsworld.com/NewReleases?releaseDate=03/09/2022
* https://www.previewsworld.com/Catalog/Series/128928-REED-GUNTHER
* https://www.previewsworld.com/Catalog/MAY190690

## Alternate Sources
### Fresh Comics
* https://freshcomics.us/issues/2022-03-02
* https://freshcomics.us/issue/SEP217015/arkham-city-the-order-of-the-world-2-yasmine-putri-card-stock-cover
* https://freshcomics.us/issues/2020-08-19
* https://freshcomics.us/issues/2016-01-06

### GrepComics
* https://grepcomics.io/releases/2016-7-13 (farthest it goes back)
* https://grepcomics.io/api (Can't get an API key anymore)    )

# Coding Sources

Tutorials that helped with some of the concepts:
* https://levelup.gitconnected.com/stop-using-a-starter-node-js-project-and-build-your-own-38a97aa723f9
* https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/
* https://thinkster.io/tutorials/node-json-api/initializing-a-starter-node-project

