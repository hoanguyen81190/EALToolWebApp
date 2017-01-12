import store from '../../core/store';
import s from './styles.css';

import history from '../../core/history';

import {TreeChip, TreeCard} from '../../components/MDL/CustomMDLComponents';

import documentIcon from '../../resources/Document-50.png';

const React = require('react');

class ConditionNew extends React.Component {
  constructor() {
    super();
    this.type = null;
    this.value = false;
    this.children = [];
    this.properChildren = [];
  }

  updateBarrier(){
    if(this.props.parent === undefined){
      this.updateConditionState();
    }
    else{
      this.props.parent.updateBarrier();
    }
  }

  handleConditionClicked(){
    this.value = !this.value;
    this.forceUpdate();
    this.updateBarrier();
  }

  /**
  * Updates the visual state of the condition tree
  */
  updateConditionState(){
      if (this.type === 'Leaf') {
        return this.value;
      }

      var childrenValues = [];
      this.children.map((item) =>
      {
        childrenValues.push(this.refs[item].updateConditionState());
      });

      switch (this.type) {
        case 'OR':
          this.value = childrenValues.reduce((a, b) => a || b);
          break;
        case 'AND':
          this.value = childrenValues.reduce((a, b) => a && b);
          break;
        default:
          break;
      }

      this.forceUpdate();
  }

  getValue() {

    if (this.type === 'Leaf') {
      return this.value;
    }

    var children = [];
    this.children.map((item) => {children.push(this.refs[item].getValue())});

    switch (this.type) {
      case 'OR':
        return children.reduce((a, b) => a || b);
      case 'AND':
        return children.reduce((a, b) => a && b);
      case 'XOR':
        return children.reduce((a, b) => a ^ b);
      default:
        return false;
    }
  }

  renderLeafNode(){
    var conditionColor;

    if(this.value){
      conditionColor = "mdl-color--red-400";
    }
    else{
      conditionColor = "mdl-color--green-300";
    }

    var treeCardContent = <span  dangerouslySetInnerHTML={{__html: this.props.conditionBody.description.text}}/>;

    var element =
        <TreeCard color={conditionColor}
          callback={this.handleConditionClicked.bind(this)} cardContent={treeCardContent}
          treeCardStyling={s.conditionCard} cardContentStyling={s.conditionCardText}
          noChip={true}
        />;

    return element;
  }

  renderLogicNode(){
    var logicConditionColor;
    if(this.value){
     logicConditionColor = "mdl-color--red-400";
    }
    else{
      logicConditionColor = "mdl-color--green-300";
    }

    var noTextChange = "";
    var updateTreeCallback = "";
    if(this.props.mode === 'classification'){
      updateTreeCallback = this.props.updateTreeCallback;
      noTextChange = s.noTextCursorChange;
    }

    this.children = [];
    var element =
          <div>
         {
           this.props.conditionBody.children.map((ele, index) => {
             var child = "child" + index;
             this.children.push(child);
             var element;

             if(index != this.props.conditionBody.children.length-1) /* Condition + Operator */
             {
               var noChip = "";
               if(index > 0){
                 noChip = true;
               }
               element =
                  <div>
                   <ConditionNew conditionBody={ele} index = {index} mode = {this.props.mode} key={index}
                    ref={child} updateTreeCallback={updateTreeCallback} activeCondition={this.props.activeCondition}
                    parent={this} noChip={noChip}/>
                   <div className={s.logicConditionWrapper + " " + logicConditionColor}>
                    <TreeChip color={logicConditionColor} chipContent={this.props.conditionBody.type}
                     chipStyling={s.logicTreeChip} chipText="L" chipTextStyling={noTextChange + " " + s.ealText}
                     chipColor="mdl-color--deep-purple-500" chipContentStyling={noTextChange}
                     />
                   </div>
                 </div>;
             }
             else{ /* For the rest of the elements we only add the condition */
               element =
                   <ConditionNew conditionBody = {ele} index = {index} mode = {this.props.mode} key={index}
                      ref={child} updateTreeCallback={updateTreeCallback} activeCondition={this.props.activeCondition}
                      parent={this} noChip={true}
                    />;
             }
             return element;
           })
         }
       </div>;

    return element;
  }

  renderConditionsCard(){
    var conditionColor;
    if(this.value){
     conditionColor = "mdl-color--red-400";
    }
    else{
      conditionColor = "mdl-color--green-300";
    }

    var element = <div className={conditionColor + " " + s.firstConditionsCard}>
        <TreeChip color={conditionColor} chipStyling={s.logicTreeChip}
        chipContent="Conditions" chipText="C" chipColor="mdl-color--cyan-900"
        chipTextStyling={s.noTextCursorChange + " " + s.ealText} chipContentStyling={s.noTextCursorChange}
        />
      </div>;

    return element;
  }

  render() {
    var condition;
    var firstCondition = "";
    if(this.props.firstCondition){
      firstCondition = this.renderConditionsCard();
    }

    this.type = this.props.conditionBody.type;
    if(this.type === "Leaf") {
      var leafNode = this.renderLeafNode();
      condition = <div>{firstCondition}{leafNode}</div>;
    }
    else {
      var logicNode = this.renderLogicNode();
      condition = <div>{firstCondition}{logicNode}</div>;
    }
    return condition;
  }
}

class BarrierTableNew extends React.Component {
  constructor(props) {
    super(props);
    this.children = [];
    this.activeBarrierCellProductIndex = null;
  }

  clearActiveBarrierCell(){
    this.activeBarrierCellProductIndex = null;
    this.forceUpdate();
  }

  setActiveBarrierCell(productIndex, page, range){
    this.props.clearBarrierHighights();
    this.activeBarrierCellProductIndex = productIndex;
    this.props.documentCallback(page, range);
    this.forceUpdate();
  }

  getValue() {
    var numberOfLoss = 0;
    var numberOfPotentialLoss = 0;
    this.props.barrier.products.map((p, index) => {
      var lossRef = 'loss' + index;
      var potentialLossRef = 'potential_loss' + index;
      if(this.refs[lossRef] && this.refs[lossRef].getValue()) numberOfLoss++;
      if(this.refs[potentialLossRef] && this.refs[potentialLossRef].getValue()) numberOfPotentialLoss++;
    });
    var result = {
      loss: (numberOfLoss > 0),
      potential_loss: (numberOfPotentialLoss > 0)
    }
    return result;
  }

  getCondition(condition, type, index){
    var result;
    if(Object.keys(condition).length === 0 && condition.constructor === Object)
    {
      result =
        <div>
          <div className={`mdl-color--green-300 ${s.firstConditionsCard}`}>
            <TreeChip color="mdl-color--green-300" chipStyling={s.logicTreeChip}
            chipContent="Conditions" chipText="C" chipColor="mdl-color--cyan-900"
            chipTextStyling={s.noTextCursorChange + " " + s.ealText} chipContentStyling={s.noTextCursorChange}
            />
          </div>
          <TreeCard
            cardContent="None" treeCardStyling={s.conditionCard}
            cardContentStyling={s.conditionCardText} noChip={true}
          />

        </div>;
    }
    else {
      var ref = type + '' + index;
      result = <ConditionNew conditionBody={condition} ref={ref} firstCondition={true}/>;
    }
    return result;
  }

  getRow(product, productIndex) {

    var activeClassName = "";

    if(productIndex === this.activeBarrierCellProductIndex){
      activeClassName = s.activeBarrierTableCell;
    }

    var row =
          <tr className={s.barrierTableRow}>
            <td className={s.barrierTableCell + " " + activeClassName} onClick={
               () => this.setActiveBarrierCell(productIndex, product.description.ref.page, product.description.ref.range)}>
                  {(productIndex+1) + '. ' + product.name + ' '}
                  <img className={s.documentIcon} src={documentIcon} alt="Document icon"/>
            </td>
            <td className={s.barrierTableCell}>
              <div className={s.conditionsWrapper}>
                {this.getCondition(product.loss, 'loss', productIndex)}
              </div>
            </td>
            <td className={s.barrierTableCell}>
              <div className={s.conditionsWrapper}>
                {this.getCondition(product.potential_loss, 'potential_loss', productIndex)}
              </div>
            </td>
          </tr>;
    return row;
  }

  render() {
    var table =
      <table className={s.barrierTable}>
        <thead>
          <tr className={s.barrierTableHeader}>
            <th className={s.barrierTableHeaderFirstCol}>{this.props.barrier.name}</th>
            <th>Loss</th>
            <th>Potential Loss</th>
          </tr>
        </thead>
        <tbody>
          {this.props.barrier.products.map((product, productIndex) => {
            return this.getRow(product, productIndex);
          })}
        </tbody>
      </table>

    return(table);
  }
}

export default BarrierTableNew;
