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

class TreeChip extends React.Component{
  render(){
    return <span className={`mdl-chip mdl-chip--contact ${this.props.color}`} >
      <span className={`mdl-chip__contact mdl-color--cyan-900 mdl-color-text--white ${s.ealText}`}>{this.props.chipText}</span>
      <span className={`mdl-chip__text `}>{this.props.content}</span>
    </span>;
  }
}

class TreeCard extends React.Component{
  render(){
    var treeCard =
    <div className={`mdl-card ${s.conditionCard}`} onClick={this.props.callback}>
      <div className={`mdl-card__title ${this.props.color}`}>
        <span className={`mdl-chip mdl-chip--contact ${this.props.color} ${s.conditionCardTitle}`} >
          <span className={`mdl-chip__contact mdl-color--cyan-900 mdl-color-text--white ${s.ealText}`}>{this.props.chipText}</span>
          <span className={`mdl-chip__text `}>{this.props.content}</span>
        </span>
      </div>
      <div className={`mdl-card__supporting-text ${s.conditionCardText}`}>
        {this.props.description}
      </div>
   </div>;

    return treeCard;
  }
}

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

  handleChangeChk(event) {
    this.value = event.target.checked;

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
        conditionColor = "mdl-color--green-300";
      }
      else{
        conditionColor = "mdl-color--red-400";
      }
    }
    else{ /* Otherwise we use a pre-determined color */
        //conditionColor = "mdl-color--green-300";
        conditionColor = "mdl-color--indigo-100";
    }

    var element;
      if(this.props.mode === 'classification') { /* Main Content Panel */
        var treeCardContent = <span  dangerouslySetInnerHTML={{__html: this.props.conditionBody.description.text}}/>;
        var conditionAppearance = <TreeCard color={conditionColor} content={`Condition ${(this.props.index + 1)}`} callback={this.handleConditionClicked.bind(this)} description={treeCardContent} chipText="C"/>;

        element =
        <li className={s.treeIndent + " " + s.leafNode}>
           {conditionAppearance}
        </li>;
      }
      else{ /* Overview Panel */
        var conditionAppearance = <TreeChip color={conditionColor} content={`Condition ${(this.props.index + 1)}`} chipText="C" />
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
        logicConditionColor = "mdl-color--green-300";
      }
      else{
        logicConditionColor = "mdl-color--red-400";
      }
    }
    else{ /* Otherwise we use a pre-determined color */
        //logicConditionColor = "mdl-color--green-300";
        //logicConditionColor = "mdl-color--red-400";
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
             if(this.props.conditionBody.children.length % 2 === 0){
               logicIndex = (this.props.conditionBody.children.length / 2) -1;
             }
             else{
               logicIndex = Math.floor(this.props.conditionBody.children.length / 2);
               moveLogicOperator = s.moveLogicOperator;
             }

             if(index === logicIndex) /* Condition + Operator */
             {
               element =
               <li>
                   <ul>
                     <Condition conditionBody = {ele} index = {index} mode = {this.props.mode} key={index} ref={child} updateTreeCallback={updateTreeCallback} activeCondition={this.props.activeCondition}/>
                   </ul>
                   <span className={`mdl-chip mdl-chip--contact ${logicConditionColor} ${moveLogicOperator}`} >
                     <span className={`mdl-chip__contact mdl-color--deep-purple-500 mdl-color-text--white ${noTextChange} ${s.ealText}`}>L</span>
                     <span className={`mdl-chip__text ${noTextChange}`}>{this.props.conditionBody.type}</span>
                   </span>
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

  //TODO decide if it is enough to click on the EAL or if we want the entire tree to be clickable
  /*handleClick(criterion) {
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
  }*/

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
        mdlColor = "mdl-color--green-300";
      }
      else{
        mdlColor = "mdl-color--red-400";
      }
    }
    else{
      //mdlColor = "mdl-color--green-300";
      mdlColor = "mdl-color--indigo-100";
    }

    var element =
      <div className={s.treeIndent }>
        <span className={`mdl-chip mdl-chip--contact ${mdlColor}`}>
          <span className={`mdl-chip__contact mdl-color--green-900 mdl-color-text--white ${textCursorClass} ${s.ealText}`}>E</span>
          <span className={`mdl-chip__text ${textCursorClass}`}>{this.props.criterion.name}</span>
        </span>
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
          <span className={`mdl-chip mdl-chip--contact ${overviewColor}`}>
            <span className={`mdl-chip__contact mdl-color--orange-900 mdl-color-text--white ${s.ealText}`}>EAL</span>
            <span className="mdl-chip__text">{this.props.emergencyLevel}</span>
          </span>
        </div>
        <Criterion {...this.props} />
      </div>;
    }
    else {  /* Main Content Panel */
      element =
      <div className={s.treeIndent + " " + s.mainContentTreeContainer}>
          <span className={`mdl-chip mdl-chip--contact ${currentTreeNodeColor}`}>
            <span className={`mdl-chip__contact mdl-color--orange-900 mdl-color-text--white ${s.noTextCursorChange} ${s.ealText}`}>EAL</span>
            <span className={`mdl-chip__text ${s.noTextCursorChange}`}>{this.props.emergencyLevel}</span>
          </span>
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
      conditionID: 0
    };
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

    for(var index = 0; index < regCat.emergency_categories.length; index++) {
      var emer_cat = regCat.emergency_categories[index];
      var hasCriterion = false;
      for (var i = 0; i < emer_cat.criterions.length; i++) {
        if(emer_cat.criterions[i].name === store.getState().criterionObject.name) {
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

    if(this.refs.classificationCriterion.getValue()) {
      text = <p>A <b>{store.getState().recognitionCategory}</b> emergency event with emergency level <b>{store.getState().emergencyLevel}</b> has occured.</p>;
    }
    else {
      text = "There is no emergency event";
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
  }

  getFooterContent() {
    return (
      <Button id='classSubmitButton' className={s.submit_button} type='raised' onClick={()=>{this.handleSubmit()}}>
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

    return (
      <Layout className={s.content} footerLeftContent={this.getFooterContent()}>
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
