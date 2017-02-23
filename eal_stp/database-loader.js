
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

    this.resetFissionProductBarriers(undefined);
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
      emergencyCategory.value = undefined;
    }
    if(emergencyCategory.criterions.length !== undefined) {
      for (var cri_i = 0; cri_i < emergencyCategory.criterions.length; cri_i++) {
        this.resetCriterion(emergencyCategory.criterions[cri_i], undefined);
      }
    }
  }

  resetCriterion(criterion, mode) {
    if(criterion.value !== undefined) {
      if(mode === undefined) criterion.value = undefined;
      else delete criterion.value[mode];
    }
    if(criterion.alert_level !== undefined) {
      for (var alert_i = 0; alert_i < criterion.alert_level.length; alert_i++) {
        this.resetAlertLevel(criterion.alert_level[alert_i], mode);
      }
    }
  }

  resetAlertLevel(alert_level, mode) {
    if(alert_level.value !== undefined) {
      if(mode === undefined) alert_level.value = undefined;
      else delete alert_level.value[mode];
    }
    if(alert_level.conditions !== undefined) {
      this.resetCondition(alert_level.conditions, mode);
    }
  }

  resetCondition(condition, mode) {
    if(condition.value !== undefined) {
      if(mode === undefined) condition.value = undefined;
      else delete condition.value[mode];
    }
    if(condition.children !== undefined) {
      for(var child_i = 0; child_i < condition.children.length; child_i++) {
        this.resetCondition(condition.children[child_i], mode);
      }
    }
  }

  resetFissionProductBarriers(mode) {
    for(var bar_i = 0; bar_i < this.data.fission_product_barriers.length; bar_i++) {
      var barrier = this.data.fission_product_barriers[bar_i];
      if(barrier.value !== undefined) {
        if(mode === undefined) {
          barrier.value = undefined;
        }
        else {
          delete barrier.value[mode];
        }
      }
      if (barrier.products !== undefined) {
        for(var prod_i = 0; prod_i < barrier.products.length; prod_i++) {
          this.resetProduct(barrier.products[prod_i], mode);
        }
      }
    }
  }

  resetProduct(product, mode) {
    if(product.loss.value !== undefined) {
      this.resetConditionWithMode(product.loss, mode);
    }
    if(product.potential_loss.value !== undefined) {
      this.resetConditionWithMode(product.potential_loss, mode);
    }
  }
}

export let eALDocument = new EALDocument();
