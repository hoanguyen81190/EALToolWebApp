import store from '../../core/store';
import bs from './barrierTableSTP.css';

import history from '../../core/history';

import {TreeChip, TreeCard} from '../../components/MDL/CustomMDLComponents';
import {Condition} from '../../components/MDL/ConditionComponents';

import documentIcon from '../../resources/Document-50.png';
import greenCheck from '../../resources/green_check.png';
import redCheck from '../../resources/red_check.png';

const React = require('react');

class BarrierConditionCard extends React.Component {
  constructor() {
    super();
    this.loss = false;
    this.potential_loss = false;
  }
  conditionCallbackFunc() {
    //update barrier when condition is triggered
    this.loss = this.refs["loss"].getValue();
    this.potential_loss = this.refs["potential_loss"].getValue();
    this.props.barrierCallBack();
  }

  clearActiveBarrierCell(){
    this.activeBarrierCellProductIndex = null;
    this.forceUpdate();
  }

  setActiveBarrierCell(productIndex, page, range){
    console.log(page);
    console.log(range);
    // this.props.clearBarrierHighights();
    // this.activeBarrierCellProductIndex = productIndex;
    this.props.documentCallback(page, range);
    this.forceUpdate();
  }

  getValue() {
    return {
      'loss': this.loss,
      'potential_loss': this.potential_loss
    }
  }

  render() {
    var lossColor = {
      'trueColor': "mdl-color--red-400",
      'falseColor': "mdl-color--green-300"
    };

    var potential_lossColor = {
      'trueColor': "mdl-color--amber-600",
      'falseColor': "mdl-color--green-300"
    };
    var lossConditionColor;
    if(this.loss){
     lossConditionColor = "mdl-color--red-400";
    }
    else{
      lossConditionColor = "mdl-color--green-300";
    }

    var potentiallossConditionColor;
    if(this.potential_loss){
     potentiallossConditionColor = "mdl-color--amber-600";
    }
    else{
      potentiallossConditionColor = "mdl-color--green-300";
    }

    var ele = <table className={bs.barrierPropertyTable}>
      <thead>
        <tr>
          <th className={bs.barrierProperty + " " + bs.barrierCell + " " + bs.barrierPropertyCell}>{this.props.productIndex + 1}</th>
          <th className={bs.barrierLoss + " " + bs.barrierCell + " " + lossConditionColor}>Loss</th>
          <th className={bs.barrierPotentialLoss + " " + bs.barrierCell  + " " + potentiallossConditionColor}>Potential Loss</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={bs.barrierCell + " " + bs.barrierCellPadding + " " + bs.barrierPropertyCell}
            onClick={
               () => this.setActiveBarrierCell(this.props.productIndex, this.props.content.description.ref.page, this.props.content.description.ref.range)}>
               {this.props.content.name}
             </td>
          <td className={bs.barrierCell}>
            <Condition ref="loss" content={this.props.content.loss}
              callback={()=>this.conditionCallbackFunc()}
              conditionColor={lossColor}/>
          </td>
          <td className={bs.barrierCell}>
            <Condition ref="potential_loss" content={this.props.content.potential_loss}
              callback={()=>this.conditionCallbackFunc()}
              conditionColor={potential_lossColor}/>
          </td>
        </tr>
      </tbody>
    </table>;
    return ele;
  }
}

class BarrierCard extends React.Component {
  constructor() {
    super();
    this.status = 'normal';
  }

  barrierCardCallBack() {
    this.getValue();
    this.forceUpdate();
  }

  getValue() {
    var numberOfLoss = 0;
    var numberOfPotentialLoss = 0;
    this.props.barrier.products.map((p, index) => {
      var barrierConditionRef = 'barrierCondition' + index;
      if(this.refs[barrierConditionRef]) {
        var conditionStatus = this.refs[barrierConditionRef].getValue();
        numberOfLoss += conditionStatus.loss ? 1 : 0;
        numberOfPotentialLoss += conditionStatus.potential_loss ? 1 : 0;
      }
    });
    if (numberOfLoss > 0) {
      this.status = 'loss';
    }
    else if (numberOfPotentialLoss > 0) {
      this.status = 'potential_loss';
    }
    else {
      this.status = 'normal';
    }
    var result = {
      loss: (numberOfLoss > 0),
      potential_loss: (numberOfPotentialLoss > 0)
    }
    return result;
  }
  render() {
    var stateColor = "mdl-color--green-300";
    if(this.status === 'loss'){
     stateColor = "mdl-color--red-400";
    }
    else if(this.status === 'potential_loss') {
      stateColor = "mdl-color--amber-600";
    }
    else{
      stateColor = "mdl-color--green-300";
    }

    var ele = <TreeCard
      color={stateColor}
      chipStyling={bs.barrierNameChip}
      chipContent={this.props.barrier.name} noCircle={true} treeCardStyling={bs.barrierCard}
      cardContent={this.props.barrier.products.map((card, index)=>{
        return <BarrierConditionCard ref={'barrierCondition'+index} content={card}
          productIndex={index}
          clearBarrierHighights={this.props.clearBarrierHighights}
          documentCallback={this.props.documentCallback}
          barrierCallBack={() => {this.barrierCardCallBack()}}

          />
      })}
      />;
    return ele;
  }
}

export default BarrierCard;
