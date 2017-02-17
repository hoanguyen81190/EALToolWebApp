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

  setActiveAlertLevelCell(alertLevelIndex, page, range){
    if(this.activeAlertLevelCellIndex !== alertLevelIndex){
      this.props.clearAlertLevelHighlights();
      this.activeAlertLevelCellIndex = alertLevelIndex;
      this.props.documentCallback(page, range);
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

    var outlineClass = "";
    if(this.activeAlertLevelCellIndex !== null){
      outlineClass = cats.sideShadows + " " + cats.roundedOutline;
    }
    else{
      outlineClass = cats.roundedOutline;
    }

    var ele =
    <table className={cats.barrierPropertyTable + " " + outlineClass}
      onClick={ () => this.setActiveAlertLevelCell(this.props.alertLevelIndex, this.props.description.ref.page, this.props.description.ref.range)}>
      <thead >
        <tr >
          <th className={cats.barrierCell + " " + conditionColor}>{this.props.alert_level.level}</th>
        </tr>
      </thead>
      <tbody>
        <tr className={cats.borderTop}>
          <td className={cats.barrierCell + " " + cats.borderTop}>
            <Condition firstCondition={true} ref="condition" content={this.props.alert_level.conditions}
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
  }

  categoryCardCallBack() {
    this.getValue();
    this.forceUpdate();
  }

  clearActiveCategoryCell(){
    this.props.criterion.alert_level.map((card, index)=>{
      this.refs['alertLevelCondition'+index].clearActiveAlertLevelCell();
    });
  }

  getValue() {
    this.value = false;
    this.alert_level = null;
    this.props.criterion.alert_level.map((p, index) => {
      var alertLevelConditionRef = 'alertLevelCondition' + index;
      if(this.refs[alertLevelConditionRef]) {
        var conditionStatus = this.refs[alertLevelConditionRef].getValue();
        if(conditionStatus) {
          this.value = conditionStatus;
          this.alert_level = this.refs[alertLevelConditionRef].getLevel();
          return {
            'value': this.value,
            'alert_level': this.alert_level
          }
        }
      }
    });

    return {
      'value': this.value,
      'alert_level': this.alert_level
    }
  }
  render() {
    var stateColor = "mdl-color--green-300";
    if(this.value){
     stateColor = "mdl-color--red-400";
    }

    var ele = <TreeCard
      color={stateColor}
      chipStyling={cats.barrierNameChip}
      chipContent={this.props.recognitionCategory} noCircle={true} treeCardStyling={cats.barrierCard}
      cardContentStyling={cats.barrierCardContent}
      cardContent={
        <div className={cats.clickable} onClick={() => this.props.documentCallback(this.props.criterion.description.ref.page, this.props.criterion.description.ref.range)}>
          <div className={cats.initialCondition}>
            <div className={cats.initialConditionText}>
              Initial Condition:
            </div>
            <span className={cats.initialConditionDescription} dangerouslySetInnerHTML={{__html: this.props.criterion.description.text}}/>
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
      />;
    return ele;
  }
}

export default CategoryCard;
