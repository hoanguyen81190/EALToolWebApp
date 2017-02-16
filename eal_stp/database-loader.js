
import jsonData from './sap_data.json';
export class EALDocument {
  constructor() {
    // this.data = require('json!./data.json');
    this.data = jsonData;
  }

  getRecognitionCategoryData(name) {
    for(var i = 0; i < this.data.recognition_categories.length; i ++){
      if(this.data.recognition_categories[i].name === name) {
        return this.data.recognition_categories[i];
      }
    }
    return null;
  }
}

export let eALDocument = new EALDocument();
