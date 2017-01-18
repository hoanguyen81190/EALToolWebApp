import store from '../../core/store';
import s from './styles.css';

import history from '../../core/history';

import {TreeChip, TreeCard} from '../../components/MDL/CustomMDLComponents';

import documentIcon from '../../resources/Document-50.png';
import greenCheck from '../../resources/green_check.png';
import redCheck from '../../resources/red_check.png';

const React = require('react');

/* Used to generate unique ids for react elements in lists */
let uniqueID = 0;
function generateID(){
  uniqueID++;
  return uniqueID;
}

class ConditionNew extends React.Component {
  componentWillMount(){
    this.id = generateID();
  }

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
        if(this.props.firstCondition){
          this.props.tableCallback.forceUpdate();
        }
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
      this.props.tableCallback.forceUpdate();
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
    var checkImage;
    var firstConditionStyle;

    if(this.value){
      conditionColor = "mdl-color--red-400";
      checkImage = redCheck;
    }
    else{
      conditionColor = "mdl-color--green-300";
      checkImage = greenCheck;
    }

    var treeCardContent = <div><span  dangerouslySetInnerHTML={{__html: this.props.conditionBody.description.text}}/><img className={s.checkImage} src={checkImage} alt="Check icon"/></div>;

    var element =
        <TreeCard color={conditionColor}
          callback={this.handleConditionClicked.bind(this)} cardContent={treeCardContent}
          treeCardStyling={s.conditionCard + " " + s.clickable} cardContentStyling={s.conditionCardText}
          noChip={true} key={this.id}
        />;

    return element;
  }

  renderLogicNode(){
    var logicConditionColor;
    /*if(this.value){
     logicConditionColor = "mdl-color--red-400";
    }
    else{
      logicConditionColor = "mdl-color--green-300";
    }*/

    logicConditionColor = "mdl-color--indigo-50";

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
                  <div key={"node" + this.id + "" + index}>
                   <ConditionNew conditionBody={ele} index = {index} mode = {this.props.mode}
                    ref={child} activeCondition={this.props.activeCondition}
                    parent={this} noChip={noChip}/>
                   <div className={s.logicConditionWrapper + " " + logicConditionColor}>
                    <TreeChip color={logicConditionColor} chipContent={this.props.conditionBody.type}
                     chipStyling={s.logicTreeChip} chipText="L" chipTextStyling={s.noTextCursorChange + " " + s.ealText}
                     chipColor="mdl-color--deep-purple-500" chipContentStyling={s.noTextCursorChange}
                     />
                   </div>
                 </div>;

                 //No chip circle
                 /*element =
                    <div key={"node" + this.id + "" + index}>
                     <ConditionNew conditionBody={ele} index = {index} mode = {this.props.mode}
                      ref={child} activeCondition={this.props.activeCondition}
                      parent={this} noChip={noChip}/>
                     <div className={s.logicConditionWrapper + " " + logicConditionColor}>
                      <TreeChip color={logicConditionColor} chipContent={this.props.conditionBody.type}
                       chipStyling={s.logicTreeChip} chipContentStyling={s.noTextCursorChange + " " + s.chipContentText}
                       noCircle={true}
                       />
                     </div>
                   </div>;*/
             }
             else{ /* For the rest of the elements we only add the condition */
               element =
                   <ConditionNew conditionBody = {ele} index = {index} mode = {this.props.mode}
                      ref={child} activeCondition={this.props.activeCondition}
                      parent={this} noChip={true} key={"node" + this.id + "" + index}
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

    /*var element = <div className={conditionColor + " " + s.firstConditionsCard}>
        <TreeChip color={conditionColor} chipStyling={s.logicTreeChip}
        chipContent={this.props.conditionType} chipText="C" chipColor="mdl-color--cyan-900"
        chipTextStyling={s.noTextCursorChange + " " + s.ealText} chipContentStyling={s.noTextCursorChange}
        />
      </div>;*/

    //No header
    var element = "";

    return element;
  }

  render() {
    var condition;
    var firstCondition = "";
    var firstConditionStyle = "";
    if(this.props.firstCondition){
      firstCondition = this.renderConditionsCard();
      firstConditionStyle = s.firstConditionStyle;
    }

    this.type = this.props.conditionBody.type;
    if(this.type === "Leaf") {
      var leafNode = this.renderLeafNode();
      condition = <div className={firstConditionStyle}>{firstCondition}{leafNode}</div>;
    }
    else {
      var logicNode = this.renderLogicNode();
      condition = <div className={firstConditionStyle}>{firstCondition}{logicNode}</div>;
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

  componentWillMount(){
    this.id = generateID();
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
    var conditionType;
    if(type === "loss"){
      conditionType = "Loss"
    } else{
      conditionType = "Potential Loss"
    }

    var result = "";
    if(Object.keys(condition).length === 0 && condition.constructor === Object)
    {
      //No header
      result =
        <div>
          <TreeCard
            cardContent="None" treeCardStyling={s.conditionCard}
            cardContentStyling={s.conditionCardText} noChip={true}
          />
        </div>;

      /*result =
        <div>
          <div className={`mdl-color--green-300 ${s.firstConditionsCard}`}>
            <TreeChip color="mdl-color--green-300" chipStyling={s.logicTreeChip}
            chipContent={type} chipText="C" chipColor="mdl-color--cyan-900"
            chipTextStyling={s.noTextCursorChange + " " + s.ealText} chipContentStyling={s.noTextCursorChange}
            />
          </div>
          <TreeCard
            cardContent="None" treeCardStyling={s.conditionCard}
            cardContentStyling={s.conditionCardText} noChip={true}
          />
        </div>;*/
    }
    else {
      var ref = type + '' + index;
      result = <ConditionNew conditionBody={condition} ref={ref} conditionType={conditionType} firstCondition={true} tableCallback={this}/>;
    }
    return result;
  }

  getConditionHeader(product, productIndex){
    var activeClassName = "";

    if(productIndex === this.activeBarrierCellProductIndex){
      activeClassName = s.activeBarrierTableCell;
    }

    var conditionHeader =
        <div className={"mdl-cell mdl-cell--12-col mdl-color--green-300 " + s.headerCell} onClick={
           () => this.setActiveBarrierCell(productIndex, product.description.ref.page, product.description.ref.range)}>
              {(productIndex+1) + '. ' + product.name + ' '}
              <img className={s.conditionHeaderIcon} src={documentIcon} alt="Document icon"/>
        </div>;
    return conditionHeader;
  }

  getConditionData(product, productIndex){
    var conditionData = <div>
    <div className={"mdl-cell mdl-cell--6-col mdl-color--green-300 " + s.headerCell}>
        {this.getCondition(product.loss, "Loss", productIndex)}
    </div>
    <div className={"mdl-cell mdl-cell--6-col mdl-color--green-300 " + s.headerCell}>
        {this.getCondition(product.potential_loss, "Potential Loss", productIndex)}
    </div>
  </div>;

    return conditionData;
  }

  getRow(product, productIndex) {
    var activeClassName = "";

    if(productIndex === this.activeBarrierCellProductIndex){
      activeClassName = s.activeBarrierTableCell;
    }

    var lossClassName = "";
    var lossFillerDiv = "";
    var lossWrapperClassName ="";
    var lossCondition = this.getCondition(product.loss, 'loss', productIndex);
    if(product.loss.type === "Leaf"){
      lossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.loss.type === undefined){
      lossClassName = s.tableCellNoneFiller + " mdl-color--white";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    }

    var potLossClassName = "";
    var potLossFillerDiv = "";
    var potLossWrapperClassName ="";
    var potLossCondition = this.getCondition(product.potential_loss, 'potential_loss', productIndex);
    if(product.potential_loss.type === "Leaf"){
      potLossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      potLossFillerDiv = <div className={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.potential_loss.type === undefined){
      potLossClassName = s.tableCellNoneFiller + " mdl-color--white";
      potLossFillerDiv = <div className ={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    }

    var newRow =
        <tr className={s.barrierTableRow} key={"barrierow" + productIndex + "" + this.id}>
          <td colspan="3" className={s.barrierTableCell + " " + s.tableCellTest}>
            <table className={s.innerTable}>
              <thead>
                <tr>
                  <th className={s.innerBarrierTableHeader + " mdl-color--green-300 " + activeClassName} onClick={
                     () => this.setActiveBarrierCell(productIndex, product.description.ref.page, product.description.ref.range)}
                     colspan="2">
                    {(productIndex+1) + '. ' + product.name + ' '}<img className={s.documentIcon} src={documentIcon} alt="Document icon"/>
                  </th>
                </tr>
              </thead>
                <tbody>

                </tbody>
              </table>
          </td>
        </tr>;

    var row =
        <tr className={s.barrierTableRow} key={"barrierow" + productIndex + "" + this.id}>
            <td className={s.barrierTableCell + " " + activeClassName} onClick={
               () => this.setActiveBarrierCell(productIndex, product.description.ref.page, product.description.ref.range)}>
                  {(productIndex+1) + '. ' + product.name + ' '}
                  <img className={s.documentIcon} src={documentIcon} alt="Document icon"/>
            </td>

            <td className={s.barrierTableCell + " " + lossClassName}>
                {lossCondition}
                {lossFillerDiv}
            </td>
            <td className={s.barrierTableCell + " " + potLossClassName}>
                {potLossCondition}
                {potLossFillerDiv}
            </td>
        </tr>;

        var row2 =
          <tr>
            <td colSpan="3" className={s.innerBarrierTableCell + " " + s.tableCellTest}>
            </td>
          </tr>;

    return row2;
  }

  getDataRow(product, productIndex){
    var activeClassName = "";

    if(productIndex === this.activeBarrierCellProductIndex){
      activeClassName = s.activeBarrierTableCell;
    }

    var lossClassName = "";
    var lossFillerDiv = "";
    var lossWrapperClassName ="";
    var lossCondition = this.getCondition(product.loss, 'loss', productIndex);
    if(product.loss.type === "Leaf"){
      lossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.loss.type === undefined){
      lossClassName = s.tableCellNoneFiller + " mdl-color--white";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    }

    var potLossClassName = "";
    var potLossFillerDiv = "";
    var potLossWrapperClassName ="";
    var potLossCondition = this.getCondition(product.potential_loss, 'potential_loss', productIndex);
    if(product.potential_loss.type === "Leaf"){
      potLossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      potLossFillerDiv = <div className={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.potential_loss.type === undefined){
      potLossClassName = s.tableCellNoneFiller + " mdl-color--white";
      potLossFillerDiv = <div className ={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    }

    var element = <tr className={s.barrierTableRow} key={"barrierow" + productIndex + "" + this.id}>
        <td className={s.barrierTableCell + " " + lossClassName}>
            {lossCondition}
            {lossFillerDiv}
        </td>
        <td className={s.barrierTableCell + " " + potLossClassName}>
            {potLossCondition}
            {potLossFillerDiv}
        </td>
    </tr>;

    return element;
  }

  getHeaderRow(product, productIndex){
    var activeClassName = "";

    if(productIndex === this.activeBarrierCellProductIndex){
      activeClassName = s.activeBarrierTableCell;
    }

    var lossClassName = "";
    var lossFillerDiv = "";
    var lossWrapperClassName ="";
    var lossCondition = this.getCondition(product.loss, 'Loss', productIndex);
    if(product.loss.type === "Leaf"){
      lossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.loss.type === undefined){
      lossClassName = s.tableCellNoneFiller + " mdl-color--white";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    }

    var potLossClassName = "";
    var potLossFillerDiv = "";
    var potLossWrapperClassName ="";
    var potLossCondition = this.getCondition(product.potential_loss, 'Potential Loss', productIndex);
    if(product.potential_loss.type === "Leaf"){
      potLossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      potLossFillerDiv = <div className={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.potential_loss.type === undefined){
      potLossClassName = s.tableCellNoneFiller + " mdl-color--white";
      potLossFillerDiv = <div className ={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    }


    var headerRow =
    <tr>
    <td colSpan="2" className={s.barrierTableCell + " mdl-color--green-300 " + activeClassName + " " + s.criterionHeader} onClick={
       () => this.setActiveBarrierCell(productIndex, product.description.ref.page, product.description.ref.range)}>
          {(productIndex+1) + '. ' + product.name + ' '}
          <img className={s.documentIcon} src={documentIcon} alt="Document icon"/>
    </td></tr>;

    return headerRow;
  }

  getNewRow(product, productIndex){
    var activeClassName = "";

    if(productIndex === this.activeBarrierCellProductIndex){
      activeClassName = s.activeBarrierTableCell;
    }

    var lossClassName = "";
    var lossFillerDiv = "";
    var lossWrapperClassName ="";
    var lossCondition = this.getCondition(product.loss, 'loss', productIndex);
    if(product.loss.type === "Leaf"){
      lossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.loss.type === undefined){
      lossClassName = s.tableCellNoneFiller + " mdl-color--white";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    }

    var potLossClassName = "";
    var potLossFillerDiv = "";
    var potLossWrapperClassName ="";
    var potLossCondition = this.getCondition(product.potential_loss, 'potential_loss', productIndex);
    if(product.potential_loss.type === "Leaf"){
      potLossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      potLossFillerDiv = <div className={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.potential_loss.type === undefined){
      potLossClassName = s.tableCellNoneFiller + " mdl-color--white";
      potLossFillerDiv = <div className ={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    }

    //Set the color to be green, everything is ok initially
    var conditionNameColor = "mdl-color--green-300";

    //Check if loss the condition is empty or not
    var lossConditionFound = false;
    if(lossCondition.type != "div"){
      //If the value of the condition is true we set the color to be red to indicate that a loss has occured
      if(this.refs[lossCondition.ref] && this.refs[lossCondition.ref].getValue()){
        conditionNameColor = "mdl-color--red-400";
        lossConditionFound = true;
      }
    }

    //Check if there was a loss condition, Otherwise check if the potential loss condition is empty or not
    if(!lossConditionFound && potLossCondition.type != "div"){
      //If the value is true we set the color to amber to indicate that a potential loss has occured
      if(this.refs[potLossCondition.ref] && this.refs[potLossCondition.ref].getValue()){
        conditionNameColor = "mdl-color--amber-600";
      }
    }

    var element = <tr className={s.barrierTableRow} key={"barrierow" + productIndex + "" + this.id}>
        <td className={s.barrierTableCell + " " + conditionNameColor + " " + activeClassName + " " + s.criterionHeader} onClick={
           () => this.setActiveBarrierCell(productIndex, product.description.ref.page, product.description.ref.range)}>
              <div className={s.criterionText}>{(productIndex+1) + '. ' + product.name + ' '}</div>
              <img className={s.documentIcon} src={documentIcon} alt="Document icon"/>
        </td>
        <td className={s.barrierTableCell + " " + lossClassName}>
            {lossCondition}
            {lossFillerDiv}
        </td>
        <td className={s.barrierTableCell + " " + potLossClassName}>
            {potLossCondition}
            {potLossFillerDiv}
        </td>
    </tr>;

    return element;
  }

  getNewRow2(product, productIndex){
    var activeClassName = "";

    if(productIndex === this.activeBarrierCellProductIndex){
      activeClassName = s.activeBarrierTableCell;
    }

    var lossClassName = "";
    var lossFillerDiv = "";
    var lossWrapperClassName ="";
    var lossCondition = this.getCondition(product.loss, 'loss', productIndex);
    if(product.loss.type === "Leaf"){
      lossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.loss.type === undefined){
      lossClassName = s.tableCellNoneFiller + " mdl-color--white";
      lossFillerDiv = <div className={lossClassName}> </div>;
      lossWrapperClassName = s.tableCellFillerWrapper;
    }

    var potLossClassName = "";
    var potLossFillerDiv = "";
    var potLossWrapperClassName ="";
    var potLossCondition = this.getCondition(product.potential_loss, 'potential_loss', productIndex);
    if(product.potential_loss.type === "Leaf"){
      potLossClassName = s.tableCellFiller + " mdl-color--indigo-50";
      potLossFillerDiv = <div className={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    } else if(product.potential_loss.type === undefined){
      potLossClassName = s.tableCellNoneFiller + " mdl-color--white";
      potLossFillerDiv = <div className ={potLossClassName}> </div>;
      potLossWrapperClassName = s.tableCellFillerWrapper;
    }

    //Set the color to be green, everything is ok initially
    var conditionNameColor = "mdl-color--green-300";

    //Check if loss the condition is empty or not
    var lossConditionFound = false;
    if(lossCondition.type != "div"){
      //If the value of the condition is true we set the color to be red to indicate that a loss has occured
      if(this.refs[lossCondition.ref] && this.refs[lossCondition.ref].getValue()){
        conditionNameColor = "mdl-color--red-400";
        lossConditionFound = true;
      }
    }

    //Check if there was a loss condition, Otherwise check if the potential loss condition is empty or not
    if(!lossConditionFound && potLossCondition.type != "div"){
      //If the value is true we set the color to amber to indicate that a potential loss has occured
      if(this.refs[potLossCondition.ref] && this.refs[potLossCondition.ref].getValue()){
        conditionNameColor = "mdl-color--amber-600";
      }
    }

    var element = <tr className={s.barrierTableRow} key={"barrierow" + productIndex + "" + this.id}>
        <td className={s.barrierTableCell + " " + conditionNameColor + " " + activeClassName + " " + s.criterionHeader} onClick={
           () => this.setActiveBarrierCell(productIndex, product.description.ref.page, product.description.ref.range)}>
              <div className={s.criterionText}>{(productIndex+1) + '. ' + product.name + ' '}</div>
              <img className={s.documentIcon} src={documentIcon} alt="Document icon"/>
        </td>
        <td className={s.barrierTableCell + " " + lossClassName}>
            {lossCondition}
            {lossFillerDiv}
        </td>
        <td className={s.barrierTableCell + " " + potLossClassName}>
            {potLossCondition}
            {potLossFillerDiv}
        </td>
    </tr>;

    return element;
  }


  renderNew(){

    //TODO change color based on values
    var headerColor;

    var table =
      <table className={s.barrierTable}>
        <thead>
          <tr className={s.barrierTableHeader}>
            <th className={s.barrierTableHeaderFirstCol + " mdl-color--green-300"}>{this.props.barrier.name}</th>
            <th className="mdl-color--green-300">Loss</th>
            <th className="mdl-color--green-300">Potential Loss</th>
          </tr>
        </thead>
        <tbody>
          {this.props.barrier.products.map((product, productIndex) => {
            return this.getRow(product, productIndex);
          })}
        </tbody>
      </table>;

    return table;
  }

  renderNew2(){
    //TODO change color based on values
    var headerColor;

    var table =
      <table className={s.barrierTable}>
        <thead>
          <tr className={s.barrierTableHeader}>
            <th colSpan="2" className={" mdl-color--green-300"}><div className={s.barrierName}><div className={s.barrierNameWrapper}>{this.props.barrier.name}</div></div><div className={s.barrierStatus}><div className={s.barrierNameWrapper}>Status</div></div></th>
          </tr>
        </thead>

          {this.props.barrier.products.map((product, productIndex) => {
            var headerRow = this.getHeaderRow(product, productIndex);
            var dataRow = this.getDataRow(product, productIndex);

            var element = <tbody className={s.barrierCriterion}>
                {headerRow}
                {dataRow}
            </tbody>;
            return element;
          })}

      </table>;

    return table;
  }

  renderNew3(){
    //TODO change color based on values
    var barrierColor = "mdl-color--green-300";
    var lossColor = "mdl-color--green-300";
    var potLossColor = "mdl-color--green-300";
    var lossOccured = false;

    var barrierStatus = this.getValue();
    if(barrierStatus.loss){
      lossColor = "mdl-color--red-400";
      barrierColor = lossColor;
      lossOccured = true;
    }

    if(barrierStatus.potential_loss){
      potLossColor = "mdl-color--amber-600";
      if(!lossOccured){
        barrierColor = potLossColor;
      }
    }

    var table =
      <table className={s.barrierTable}>
        <thead>
          <tr className={s.barrierTableHeader}>
            <th className={s.barrierTableHeaderFirstCol + " " + barrierColor}>{this.props.barrier.name}</th>
            <th className={s.headerLossText + " " + lossColor}>Loss</th>
            <th className={s.headerLossText + " " + potLossColor}>Potential Loss</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
          {this.props.barrier.products.map((product, productIndex) => {
            var dataRow = this.getNewRow(product, productIndex);

            var element = <tbody className={s.barrierCriterion}>
                {dataRow}
            </tbody>;
            return element;
          })}
      </table>;

    return table;
  }

  renderNew4(){
    //TODO change color based on values
    var barrierColor = "mdl-color--green-300";
    var lossColor = "mdl-color--green-300";
    var potLossColor = "mdl-color--green-300";
    var lossOccured = false;

    var barrierStatus = this.getValue();
    if(barrierStatus.loss){
      lossColor = "mdl-color--red-400";
      barrierColor = lossColor;
      lossOccured = true;
    }

    if(barrierStatus.potential_loss){
      potLossColor = "mdl-color--amber-600";
      if(!lossOccured){
        barrierColor = potLossColor;
      }
    }

    /*var table =
      <table className={s.barrierTable}>
        <thead>
          <tr className={s.barrierTableHeader}>
            <th className={s.barrierTableHeaderFirstCol + " " + barrierColor}>{this.props.barrier.name}</th>
            <th className={s.headerLossText + " " + lossColor}>Loss</th>
            <th className={s.headerLossText + " " + potLossColor}>Potential Loss</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
          {this.props.barrier.products.map((product, productIndex) => {
            var dataRow = this.getNewRow2(product, productIndex);

            var element = <tbody className={s.barrierCriterion}>
                {dataRow}
            </tbody>;
            return element;
          })}
      </table>;*/

      var table =
        <table className={s.barrierTable}>
          <thead>
            <tr className={s.barrierTableHeader}>
              <th className={s.barrierTableHeaderFirstCol + " " + barrierColor}>{this.props.barrier.name}</th>
              <th className={s.headerLossText + " " + lossColor}>Loss</th>
              <th className={s.headerLossText + " " + potLossColor}>Potential Loss</th>
            </tr>
          </thead>
          {this.props.barrier.products.map((product, productIndex) => {
            var dataRow = this.getNewRow2(product, productIndex);

            var element = <tbody className={s.barrierCriterion}>
                {dataRow}
            </tbody>;
            return element;
          })}

        </table>;

      var tableCard = <TreeCard treeCardStyling={s.barrierCard}
        cardContent={table} chipContent={this.props.barrier.name} noCircle={true}
      />

    return tableCard;
  }

  render() {
    return this.renderNew3();
  }
}

export default BarrierTableNew;
