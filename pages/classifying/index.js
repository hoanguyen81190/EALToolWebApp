import React, { PropTypes } from 'react';
import markdown from 'marked';

import Layout from '../../components/Layout';
import Button from '../../components/Button';

import s from './styles.css';

import { title, html } from './index.md';
import store from '../../core/store';
import {eALDocument} from '../../database-loader';
import spdf from "./PDFViewer";
import DialogDemo from './dialog';

import documentIcon from '../../resources/Document-50.png';

import {TreeChip, TreeCard} from '../../components/MDL/CustomMDLComponents';

class Condition extends React.Component {
  constructor() {
    super();
    this.type = null;
    this.value = false;
    this.children = [];
    this.properChildren = [];
  }

  handleConditionClicked(){
    this.value = !this.value;
    this.props.conditionBody.value = !this.props.conditionBody.value;
    this.props.updateTreeCallback(this.props.conditionBody.conditionID, this.value);
  }

  /**
  * Updates the visual state of the condition tree
  */
  updateConditionState(){
    if(this.props.activeCondition){
      //this.props.conditionBody.value
      if (this.type === 'Leaf') {
        return this.props.conditionBody.value;
      }

      var childrenValues = [];
      this.children.map((item) =>
      {
        childrenValues.push(this.refs[item].updateConditionState());
      });

      switch (this.type) {
        case 'OR':
          this.props.conditionBody.value = childrenValues.reduce((a, b) => a || b);
          break;
        case 'AND':
          this.props.conditionBody.value = childrenValues.reduce((a, b) => a && b);
          break;
        default:
          break;
      }
    }
    else{
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

    /* If this condition is part of the currently selected criterion we use the state of the condition to determine the color */
    if(this.props.activeCondition){
      if(this.props.conditionBody.value){
        conditionColor = "mdl-color--red-400";
      }
      else{
        conditionColor = "mdl-color--green-300";
      }
    }
    else{ /* Otherwise we use a pre-determined color */
        conditionColor = "mdl-color--indigo-100";
    }

    var element;
      if(this.props.mode === 'classification') { /* Main Content Panel */
        var treeCardContent = <span  dangerouslySetInnerHTML={{__html: this.props.conditionBody.description.text}}/>;
        var conditionAppearance =
          <TreeCard color={conditionColor} chipContent={`Condition ${(this.props.index + 1)}`}
            callback={this.handleConditionClicked.bind(this)} cardContent={treeCardContent} chipText="C"
            chipStyling={s.conditionCardTitle} chipTextStyling={s.ealText} treeCardStyling={s.conditionCard}
            cardContentStyling={s.conditionCardText} chipColor="mdl-color--cyan-900"/>;

        element =
        <li className={s.treeIndent + " " + s.leafNode}>
           {conditionAppearance}
        </li>;
      }
      else{ /* Overview Panel */
        var conditionAppearance = <TreeChip color={conditionColor} chipContent={`Condition ${(this.props.index + 1)}`}
          chipText="C" chipTextStyling={s.ealText} chipColor="mdl-color--cyan-900"/>

        element =
        <li className={s.treeIndent + " " + s.leafNode}>
          {conditionAppearance}
        </li>;
      }
      return element;
  }

  renderLogicNode(){
    var logicConditionColor;

    /* If this condition is part of the currently selected criterion we use the state of the condition to determine the color */
    if(this.props.activeCondition){
      if(this.props.conditionBody.value){
        logicConditionColor = "mdl-color--red-400";
      }
      else{
        logicConditionColor = "mdl-color--green-300";
      }
    }
    else{ /* Otherwise we use a pre-determined color */
        logicConditionColor = "mdl-color--indigo-100";
    }

    var noTextChange = "";
    var updateTreeCallback = "";
    if(this.props.mode === 'classification'){
      updateTreeCallback = this.props.updateTreeCallback;
      noTextChange = s.noTextCursorChange;
    }

    this.children = [];
    var element =
    <ul className={s.firstUL}>
    <li className={s.treeIndent + " " + s.logicNode}>
       <ul>
         {
           this.props.conditionBody.children.map((ele, index) => {
             var child = "child" + index;
             this.children.push(child);
             var element;

             var logicIndex = 0;
             var moveLogicOperator = "";
             var moveLogicCondition = "";
             if(this.props.conditionBody.children.length % 2 === 0){
               logicIndex = (this.props.conditionBody.children.length / 2) -1;
             }
             else{
               logicIndex = Math.floor(this.props.conditionBody.children.length / 2);
               moveLogicOperator = s.moveLogicOperator;
               moveLogicCondition = s.moveLogicCondition;
             }

             if(index === logicIndex) /* Condition + Operator */
             {
               element =
               <li>
                   <ul className={moveLogicCondition}>
                     <Condition conditionBody = {ele} index = {index} mode = {this.props.mode} key={index} ref={child} updateTreeCallback={updateTreeCallback} activeCondition={this.props.activeCondition}/>
                   </ul>
                   <TreeChip color={logicConditionColor} chipContent={this.props.conditionBody.type}
                     chipStyling={moveLogicOperator} chipText="L" chipTextStyling={noTextChange + " " + s.ealText}
                     chipColor="mdl-color--deep-purple-500" chipContentStyling={noTextChange}/>
               </li>;
             }
             else{ /* For the rest of the elements we only add the condition */
               element =
               <li>
                   <ul><Condition conditionBody = {ele} index = {index} mode = {this.props.mode} key={index} ref={child} updateTreeCallback={updateTreeCallback} activeCondition={this.props.activeCondition}/>
                 </ul>
               </li>;
             }
             return element;
           })
         }
       </ul>
     </li>
    </ul>;

    return element;
  }

  render() {
    this.type = this.props.conditionBody.type;
    if(this.props.conditionBody.type === "Leaf") {
        return (this.renderLeafNode());
    }
    else {
      return (this.renderLogicNode());
    }
  }
}

class Criterion extends React.Component {
  constructor() {
    super();
  }

  getValue() {
    if(this.refs.conditionTree != null)
    {
      return this.refs.conditionTree.getValue();
    }
    return false;
  }

  updateCriterionState(){
    if(this.refs.conditionTree != null)
    {
      this.refs.conditionTree.updateConditionState();
      this.forceUpdate();
    }
  }

  render() {
    var condition;
    var mainConditionIndentClass = "";
    var textCursorClass = "";
    var isCriterionTrue = false;

    if(typeof(this.props.criterion.conditions) == "undefined" ||
        (Object.keys(this.props.criterion.conditions).length === 0 && this.props.criterion.conditions.constructor === Object)) {
      condition = <span/>;
    }
    else {
      if(this.props.mode === "overview"){
        if(this.props.criterion === store.getState().selectedCriterionState){
          condition = <Condition
              conditionBody = {store.getState().selectedCriterionState.conditions} index={0} mode={this.props.mode} ref="conditionTree" activeCondition={true}/>;
          if(this.props.checkCriterionStateCallback(this.props.criterion.conditions)){
            isCriterionTrue = true;
          }
        }
        else{
          condition = <Condition
              conditionBody = {this.props.criterion.conditions} index = {0} mode = {this.props.mode} ref = "conditionTree" activeCondition={false}/>;
        }
      }
      else{
        textCursorClass = s.noTextCursorChange;

        condition = <Condition
                      conditionBody = {this.props.criterion.conditions}
                      index = {0}
                      mode = {this.props.mode}
                      ref = "conditionTree"
                      updateTreeCallback = {this.props.updateTreeCallback}
                      activeCondition={true}
                    />;

        if(this.props.checkCriterionStateCallback(this.props.criterion.conditions)){
          isCriterionTrue = true;
        }
      }
    }

    /* If the conditions only contains a leaf node we add a classname to handle the positioning of the leaf */
    if(this.props.criterion.conditions.children === ""){
      mainConditionIndentClass = s.singleConditionIndent;
    }

    var mdlColor = "";
    if (this.props.criterion.description.text === store.getState().criterionObject.description.text){
      if(isCriterionTrue){
        mdlColor = "mdl-color--red-400";
      }
      else{
        mdlColor = "mdl-color--green-300";
      }
    }
    else{ //Inactive
      mdlColor = "mdl-color--indigo-100";
    }

    var element =
      <div className={s.treeIndent }>
        <TreeChip color={mdlColor} chipColor="mdl-color--green-900" chipTextStyling={textCursorClass + " " + s.ealText}
          chipText="E" chipContentStyling={textCursorClass} chipContent={this.props.criterion.name}/>
        <div className={s.mainConditionTree + " " + mainConditionIndentClass}>
          {condition}
        </div>
      </div>;

    return element;
  }
}

class TreeNode extends React.Component {
  constructor () {
    super();
  }

  updateTreeState(){
    if(this.refs.criterionResult != null)
    {
      this.refs.criterionResult.updateCriterionState();
    }
  }

  getValue() {
    if(this.refs.criterionResult != null)
    {
      return this.refs.criterionResult.getValue();
    }

    return false;
  }

  handleClick(criterion) {
    var action = {
      type : 'SET_STATE',
      mode : store.getState().mode,
      recognitionCategory : store.getState().recognitionCategory,
      emergencyLevel : this.props.emergencyLevel,
      criterionObject: criterion
    }

    store.dispatch(action);
    this.props.callback.updateCriterionState(criterion);
    this.props.callback.forceUpdate();
  }

  render() {
    var element;

    var overviewColor;

    var currentTreeNodeColor = "mdl-color--amber-600";

    if(this.props.mode === 'overview') { /* Overview Panel */
      if(this.props.criterion === store.getState().criterionObject){
        overviewColor = currentTreeNodeColor;
      }
      else{
        overviewColor = "mdl-color--green-300";
      }

      element =
      <div className={s.treeIndent + " " + s.overviewTreeNodeContainer} onClick={() => this.handleClick(this.props.criterion)}>
        <div>
          <TreeChip color={overviewColor} chipText="EAL" chipColor="mdl-color--orange-900"
            chipTextStyling={s.ealText} chipContent={this.props.emergencyLevel}/>
        </div>
        <Criterion {...this.props} />
      </div>;
    }
    else {  /* Main Content Panel */
      element =
      <div className={s.treeIndent + " " + s.mainContentTreeContainer}>
          <TreeChip color={currentTreeNodeColor} chipText="EAL" chipColor="mdl-color--orange-900"
            chipTextStyling={s.noTextCursorChange + " " + s.ealText} chipContent={this.props.emergencyLevel}
            chipContentStyling={s.noTextCursorChange}/>
          <Criterion {...this.props} criterion={store.getState().selectedCriterionState} ref="criterionResult" updateTreeCallback={this.props.updateTreeCallback}/>
      </div>;
    }
    return element;
  }
}

class ClassifyingPage extends React.Component {
  constructor(){
    super();

    this.conditionID = 0;

    var action = {
      type : 'SET_CRITERION_STATE',
      criterionState: this.createCriterionStateTree(store.getState().criterionObject)
    };
    store.dispatch(action);

    this.state = {
      mode: store.getState().mode,
      recognitionCategory: store.getState().recognitionCategory,
      emergencyLevel: store.getState().emergencyLevel,
      classificationResult: "",
      conditionID: 0,
      currentClassification: "No Emergency"
    };
  }


  /**
  * Extracts the condition number from the criterion header name
  * @param {String} criterionName
  * @return {Number} conditionNumber
  */
  getCriterionConditionNumber(criterionName)
  {
    var conditionNumber = parseInt(criterionName.replace( /(^.+\D)(\d+)(\D.+$)/i,'$2'));
    return conditionNumber;
  }

  /**
  * Extracts the condition numbers of the emergency categories
  * @param {Object Array} emergencyCategories
  * @return {Integer Array} conditionNumbers
  */
  getConditionNumbers(emergencyCategories)
  {
    var conditionNumbers = [];
    for(var i = 0; i < emergencyCategories.length; i++)
    {
      for(var y = 0; y < emergencyCategories[i].criterions.length; y++)
      {
        if(this.checkIfModeApplicable(emergencyCategories[i].criterions[y]))
        {
          //Find the first occurence of a number inside a string. The first number is the criterion condition number
          var conditionNumber = this.getCriterionConditionNumber(emergencyCategories[i].criterions[y].name);
          if(conditionNumbers.indexOf(conditionNumber) === -1)
          {
            conditionNumbers.push(conditionNumber);
          }
        }
      }
    }

    return conditionNumbers;
  }


  updateCriterionState(criterion){
    var action = {
      type : 'SET_CRITERION_STATE',
      criterionState: this.createCriterionStateTree(criterion)
    };

    store.dispatch(action);
  }

  setChildrenState(item){
    if(item.type === "Leaf")
    {
      item["value"] = false;
      item["criterionID"] = this.conditionID++;
    }
    else{
      item["value"] = false;
      item["criterionID"] = this.conditionID++;
      for(var i = 0; i < item.children.length; i++)
      {
        this.setChildrenState(item.children[i]);
      }
    }
  }

  /**
  * Creates a state tree fro the current criterion
  */
  createCriterionStateTree(item){
    this.conditionID = 0; //Reset the ID before each render so that they remain the same.
    this.setChildrenState(item.conditions);
    return item;
  }

  componentDidMount() {
    document.title = title;
  }

  extractLeftPanelTree(_mode) {
    var regCat = eALDocument.getRecognitionCategoryData(store.getState().recognitionCategory);

    var leftTree = [];

    var selectedCriterionNumber = this.getCriterionConditionNumber(store.getState().criterionObject.name);

    for(var index = 0; index < regCat.emergency_categories.length; index++) {
      var emer_cat = regCat.emergency_categories[index];
      var hasCriterion = false;
      for (var i = 0; i < emer_cat.criterions.length; i++) {
        if(this.getCriterionConditionNumber(emer_cat.criterions[i].name) === selectedCriterionNumber) {
          var treeNode = <TreeNode key={leftTree.length}
            emergencyLevel={emer_cat.name}
            criterion={emer_cat.criterions[i]}
            callback={this}
            mode={_mode}
            ref={"treeNode" + index + "" + i}
            checkCriterionStateCallback={this.updateLogicConditions.bind(this)}
            />;
          hasCriterion = true;
          leftTree.push(treeNode);
          break;
        }
      }
    };
    return leftTree;
  }

  updateLogicConditions(criterionState){
    if(criterionState.type === "Leaf"){
      return criterionState.value;
    }
    else{
      var childrenValues = [];
      for(var i = 0; i < criterionState.children.length; i++){
        childrenValues.push(this.updateLogicConditions(criterionState.children[i]));
      }

      if(criterionState.type === "OR"){
        var orResult = false;
        for(var i = 0; i < childrenValues.length; i++){
          if(childrenValues[i]){
            orResult = true;
            break;
          }
        }
        criterionState.value = orResult;

      }
      else if(criterionState.type === "AND"){
        var andResult = true;
        for(var i = 0; i < childrenValues.length; i++){
          if(childrenValues[i] === false){
            andResult = false;
            break;
          }
        }
        criterionState.value = andResult;
      }

        return criterionState.value;
      }
  }

  updateStoreCriterion(criterionState, conditionID, conditionValue){
    if(criterionState.criterionID === conditionID){
      criterionState.value = conditionValue;
      return;
    }

    if(criterionState.type != "Leaf"){
      for(var i = 0; i < criterionState.children.length; i++)
      {
        this.updateStoreCriterion(criterionState.children[i], conditionID, conditionValue);
      }
    }
  }

  updateTreeState(conditionID, conditionValue){
    var criterionState = store.getState().selectedCriterionState;
    this.updateStoreCriterion(criterionState.conditions, conditionID, conditionValue);
    this.updateLogicConditions(criterionState.conditions);

    if(criterionState != null) {
      var action = {
        type : 'SET_CRITERION_STATE',
        criterionState: criterionState
      };
      store.dispatch(action);

      for (var ref in this.refs) {
        if(this.refs[ref].props.emergencyLevel != null){
          this.refs[ref].forceUpdate();
        }
      }
    }
  }

  handleSubmit(){
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    var text;

    var currentClassificationText;

    if(this.refs.classificationCriterion.getValue()) {
      currentClassificationText = store.getState().emergencyLevel;
      text = <p>A <b>{store.getState().recognitionCategory}</b> emergency event with emergency level <b>{store.getState().emergencyLevel}</b> has occured.</p>;
    }
    else {
      text = "There is no emergency event";
      currentClassificationText = "No Emergency";
    }

    if(isIE || isEdge)
    {
      alert(text);
    }
    else
    {
      this.refs.classificationDialog.setState({
        openDialog: true,
        content: text,
        title: "Classification Result",
        buttonText: "OK"
      });
    }

    this.setState({
      currentClassification: currentClassificationText
    })
  }

  getFooterContent() {
    return (
      <Button id='classSubmitButton' className={s.submitButton} type='raised' onClick={()=>{this.handleSubmit()}}>
          Submit
      </Button>
    );
  }

  render() {

    var treeData = this.extractLeftPanelTree('overview');

    var overviewTree =
      treeData.map((item) => {
      {
        return <div className={s.leftTree}><div className={s.overviewTree}>{item}</div><hr className={s.hr}/></div>;
      }});

      var currentClassification = "Current classification - " + this.state.currentClassification;

    return (
      <Layout className={s.content} footerLeftContent={this.getFooterContent()}>
          <div className= {s.recognitionCategoryText}>
            <div className={s.categoryTextWrapper}>Mode {this.state.mode} - {this.state.recognitionCategory}: {store.getState().criterionObject.name}</div>
            <div className={s.classificationTextWrapper}>{currentClassification}</div>
          </div>
          <div className={s.leftcontent}>
              {overviewTree}
          </div>
          <div className={s.maincontent} id="mainPanel">
            <div className = {s.contentTree}>
              <TreeNode
                emergencyLevel = {store.getState().emergencyLevel}
                criterion = {store.getState().criterionObject}
                mode='classification' ref="classificationCriterion"
                updateTreeCallback={this.updateTreeState.bind(this)}
                checkCriterionStateCallback={this.updateLogicConditions.bind(this)}/>
            </div>
            <div>
              <DialogDemo ref="classificationDialog"/>
            </div>
            </div>
              <div className={s.descriptioncontent}>
                <spdf.SimplePDF className={s.SimplePDF}
                  file='./classification_procedures.pdf'
                  startPage={store.getState().criterionObject.description.ref.page}
                  endPage={store.getState().criterionObject.description.ref.page + store.getState().criterionObject.description.ref.range - 1}
                />
              </div>
      </Layout>
    );
  }
}

export default ClassifyingPage;
