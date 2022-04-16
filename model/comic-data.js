
class ComicData {

  loadfile = "";
  loadfileid = "";
  title = "";
  publisher = "";
  description = "";
  price = "";
  creators = "";
  release_date = "";
  diamond_id = "";

  constructor(loadfile, loadfileid, title, publisher, description, price, creators, release_date, diamond_id) {
      this.loadfile =loadfile;
      this.loadfileid =loadfileid;
      this.title =title;
      this.publisher =publisher;
      this.description =description;
      this.price =price;
      this.creators =creators;
      this.release_date =release_date;
      this.diamond_id =diamond_id;

      if (!this.description) { this.description = "";}
      if (!this.creators) { this.creators = "";}
      if (!this.title) { this.title = "";}

      this.description = this.description.replace(/"/g, '""');
      this.description = this.description.replace(/,/g, '\,');
      this.description = this.description.replace(/'/g, '\'');
      this.creators = this.creators.replace(/"/g, '""');
      this.creators = this.creators.replace(/,/g, '\,');
      this.creators = this.creators.replace(/'/g, '\'');
      this.title = this.title.replace(/"/g, '""');
      this.title = this.title.replace(/,/g, '\,');
      this.title = this.title.replace(/'/g, '\'');



      //console.log("Loaded one in constructor");
  }

  getId() {
    return this.diamond_id;
  }

  toString() {
    return "From(" + this.loadfile + "), title(" + this.title + "), release_date(" + this.release_date + ")";
  }

  toCSV(header = false) {
      var returnCSV = "";
      if (header) {
          returnCSV += "loadfile,loadfileid,title,publisher,description,price,creators,release_date,diamond_id\n";
      }

      returnCSV += this.loadfile + "," + this.loadfileid + ",\"" + this.title + "\",\"" + this.publisher + "\",\"" + this.description + "\"," + this.price + ",\"" + this.creators + "\"," + this.release_date + "," + this.diamond_id + "\n";

      return returnCSV;
  }
}

module.exports = ComicData;//exports.ComicData = ComicData;