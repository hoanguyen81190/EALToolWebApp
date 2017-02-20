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

  getValue() {
    return this.value;
  }

  render() {
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
    if(this.activeBarrierCellProductIndex !== null){
      outlineClass = cats.sideShadows + " " + cats.roundedOutline;
    }
    else{
      outlineClass = cats.roundedOutline;
    }

    var ele = <table className={cats.barrierPropertyTable + " " + outlineClass}>
      <thead >
        <tr >
          <th className={cats.barrierCell + " " + conditionColor}>{this.props.alert_level.level}</th>
        </tr>
      </thead>
      <tbody >
        <tr >
          <td className={cats.barrierCell}>
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
    this.props.criterion.alert_level.map((p, index) => {
      var alertLevelConditionRef = 'alertLevelCondition' + index;
      if(this.refs[alertLevelConditionRef]) {
        var conditionStatus = this.refs[alertLevelConditionRef].getValue();
        if(conditionStatus) {
          this.value = conditionStatus;
          return;
        }
      }
    });

    return this.value;
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
        <div>
          {this.props.criterion.description.text}
          {this.props.criterion.alert_level.map((level, index)=>{
            return <AlertLevelCard ref={'alertLevelCondition'+index}
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
