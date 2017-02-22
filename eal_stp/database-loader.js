
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

  resetValues() {
    for(var reg_i = 0; reg_i < this.data.recognition_categories.length; reg_i ++) {
      this.resetRecognitionCategory(this.data.recognition_categories[reg_i]);
    }

    this.resetFissionProductBarriers();
  }

  resetRecognitionCategory(recognitionCategory) {
    if(recognitionCategory.value !== undefined) {
      recognitionCategory.value = undefined;
    }
    if(recognitionCategory.emergency_categories !== undefined) {
      for (var emer_i = 0; emer_i < recognitionCategory.emergency_categories.length; emer_i++) {
        this.resetEmergencyCategory(recognitionCategory.emergency_categories[emer_i]);
      }
    }
  }

  resetEmergencyCategory(emergencyCategory) {
    if(emergencyCategory.value !== undefined) {
      emergencyCategory.value = false;
    }
    if(emergencyCategory.criterions.length !== undefined) {
      for (var cri_i = 0; cri_i < emergencyCategory.criterions.length; cri_i++) {
        this.resetCriterion(emergencyCategory.criterions[cri_i]);
      }
    }
  }

  resetCriterion(criterion) {
    if(criterion.value !== undefined) {
      criterion.value = false;
    }
    if(criterion.alert_level !== undefined) {
      for (var alert_i = 0; alert_i < criterion.alert_level.length; alert_i++) {
        this.resetAlertLevel(criterion.alert_level[alert_i]);
      }
    }
  }

  resetAlertLevel(alert_level) {
    if(alert_level.value !== undefined) {
      alert_level.value = false;
    }
    if(alert_level.conditions !== undefined) {
      this.resetCondition(alert_level.conditions);
    }
  }

  resetCondition(condition) {
    if(condition.value !== undefined) {
      condition.value = false;
    }
    if(condition.children !== undefined) {
      for(var child_i = 0; child_i < condition.children.length; child_i++) {
        this.resetCondition(condition.children[child_i]);
      }
    }
  }

  resetFissionProductBarriers() {
    for(var bar_i = 0; bar_i < this.data.fission_product_barriers.length; bar_i++) {
      var barrier = this.data.fission_product_barriers[bar_i];
      if(barrier.value !== undefined) {
        barrier.value = undefined;
      }
      if (barrier.products !== undefined) {
        for(var prod_i = 0; prod_i < barrier.products.length; prod_i++) {
          this.resetProduct(barrier.products[prod_i]);
        }
      }
    }
  }

  resetProduct(product) {
    if(product.loss.value !== undefined) {
      this.resetCondition(product.loss);
    }
    if(product.potential_loss.value !== undefined) {
      this.resetCondition(product.potential_loss);
    }
  }
}

export let eALDocument = new EALDocument();
