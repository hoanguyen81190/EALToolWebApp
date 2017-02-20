import store from '../../core/store';
import cats from './categoryCardSTP.css';

import history from '../../core/history';

import {TreeChip, TreeCard} from '../../components/MDL/CustomMDLComponents';
import {Condition} from '../../components/MDL/ConditionComponents';

import documentIcon from '../../resources/Document-50.png';
import greenCheck from '../../resources/green_check.png';
import redCheck from '../../resources/red_check.png';

const React = require('react');

class AlertLevelCard extends React.Component {
  constructor() {
    super();
    this.value = false;
    this.activeAlertLevelCellIndex = null;
    this.level = null;
  }
  conditionCallbackFunc() {
    //update barrier when condition is triggered
    this.value = this.refs["condition"].getValue();
    this.props.categoryCallBack();
  }

  clearActiveAlertLevelCell(){
    if(this.activeAlertLevelCellIndex !== null){
      this.activeAlertLevelCellIndex = null;
      this.forceUpdate();
    }
  }

  getLevel() {
    return this.level;
  }

  getValue() {
    return this.value;
  }

  render() {
    this.level = this.props.alert_level.level;
    var color = {
      'trueColor': "mdl-color--red-400",
      'falseColor': "mdl-color--green-300"
    };

    var alerLevelPropertyColor;

    var conditionColor;
    if(this.value){
     conditionColor = "mdl-color--red-400";
     alerLevelPropertyColor = "mdl-color--red-400";
    }
    else{
      conditionColor = "mdl-color--green-300";
      alerLevelPropertyColor = conditionColor;
    }

    var ele =
    <table className={cats.barrierPropertyTable + " " + cats.roundedOutline}>
      <thead >
        <tr >
          <th className={cats.barrierCell + " " + conditionColor}>{this.props.alert_level.level}</th>
        </tr>
      </thead>
      <tbody>
        <tr className={cats.borderTop}>
          <td className={cats.barrierCell + " " + cats.borderTop}>
            <Condition conditionStyle={cats.condition} firstCondition={true} ref="condition" content={this.props.alert_level.conditions}
              callback={()=>this.conditionCallbackFunc()}
              conditionColor={color}/>
          </td>
        </tr>
      </tbody>
    </table>;

    return ele;
  }
}

class CategoryCard extends React.Component {
  constructor() {
    super();
    this.value = false;
    this.alert_level = null;
    this.active_card = false;
  }

  categoryCardCallBack() {
    this.getValue();
    this.forceUpdate();
  }

  clearActiveCategoryCell(){
    this.active_card = false;
    this.forceUpdate();
  }

  getValue() {
    this.value = false;
    this.alert_level = [];
    this.props.criterion.alert_level.map((p, index) => {
      var alertLevelConditionRef = 'alertLevelCondition' + index;
      if(this.refs[alertLevelConditionRef]) {
        var conditionStatus = this.refs[alertLevelConditionRef].getValue();
        if(conditionStatus) {
          this.value = conditionStatus;
          this.alert_level.push(this.refs[alertLevelConditionRef].getLevel());
        }
      }
    });

    return {
      'value': this.value,
      'alert_level': this.alert_level
    }
  }

  handleOnClick() {
    if(!this.active_card) {
      this.props.clearAlertLevelHighlights();
      this.props.documentCallback(this.props.criterion.description.ref.page, this.props.criterion.description.ref.range);

      this.active_card = true;
      this.forceUpdate();
    }
  }

  render() {
    var stateColor = "mdl-color--green-300";
    if(this.value){
     stateColor = "mdl-color--red-400";
    }

    var outlineClass = "";
    if(this.active_card) {
      outlineClass = cats.sideShadows;
    }

    var ele = <div onClick={()=>this.handleOnClick()} className={cats.treeCardWrapper + " " + outlineClass + " " + cats.clickable}>
      <TreeCard
      color={stateColor}
      chipStyling={cats.barrierNameChip}
      chipContent={this.props.recognitionCategory} noCircle={true} treeCardStyling={cats.barrierCard}
      cardContentStyling={cats.barrierCardContent}
      cardContent={
        <div className={cats.clickable}>
          <div>
          <div className={cats.initialCondition}>
            <div className={cats.initialConditionText}>
              Initiating Condition:
            </div>
            <span className={cats.initialConditionDescription} dangerouslySetInnerHTML={{__html: this.props.criterion.description.text}}/>
            <img className={cats.documentIcon} src={documentIcon} alt="Document icon"/>
            </div>
      </div>
          {this.props.criterion.alert_level.map((level, index)=>{
            return <AlertLevelCard ref={'alertLevelCondition'+index}
                                   description={this.props.criterion.description}
                                   alert_level={level}
                                   alertLevelIndex={index}
                                   clearAlertLevelHighlights={this.props.clearAlertLevelHighlights}
                                   documentCallback={this.props.documentCallback}
                                   categoryCallBack={() => {this.categoryCardCallBack()}}
                   />
          })}
      </div>
      }
      />
  </div>;

    return ele;
  }
}

export default CategoryCard;
