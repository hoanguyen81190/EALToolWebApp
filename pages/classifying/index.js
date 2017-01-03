/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

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

var checkboxID = -1;

class Condition extends React.Component {
  constructor() {
    super();
    this.type = null;
    this.value = false;
    this.children = [];
    checkboxID++;
  }

  handleChangeChk(event) {
    this.value = event.target.checked;
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

  render() {
    this.type = this.props.conditionBody.type;
    if(this.props.conditionBody.type === "Leaf") {
      if(this.props.mode === 'classification') {
        var element =
        <div  className={s.treeIndent + ' ' + s.conditionleaf}>
           <input type="checkbox" defaultChecked={false} onChange={this.handleChangeChk.bind(this)} />
           <span  dangerouslySetInnerHTML={{__html: this.props.conditionBody.description.text}}/>
         </div>;
        return element;
      }
      var element =
      <div className={s.treeIndent + ' ' + s.conditionleaf}>
        <span className="mdl-chip mdl-chip--contact mdl-color--green-300" >
          <span className="mdl-chip__contact mdl-color--teal-200 mdl-color-text--white">C</span>
          <span className="mdl-chip__text">Condition {(this.props.index + 1)}</span>
        </span>
      </div>;
      return element;
    }
    else {
      var element =
       <div className={s.treeIndent + ' ' + s.condition} operator={this.props.conditionBody.type}>
         {
           this.props.conditionBody.children.map((ele, index) => {
             var child = "child" + index;
             this.children.push(child)
             return <Condition
                 conditionBody = {ele} index = {index} mode = {this.props.mode} ref={child} key={index}/>;
           })
         }
      </div>;
      return element;
    }
  }
}

class Criterion extends React.Component {
  constructor() {
    super();
  }

  /**
  * Unchecks the checkboxes on the current page
  */
  uncheckAllCheckboxes(){
    var w = document.getElementsByTagName('input');
    for(var i = 0; i < w.length; i++){
      if(w[i].type==='checkbox'){
        w[i].checked = false;
      }
    }
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
    //Uncheck the checkboxes when we switch security levels.
    this.uncheckAllCheckboxes();
    this.props.callback.forceUpdate();
  }

  render() {
    if(typeof(this.props.criterion.conditions) == "undefined" ||
        (Object.keys(this.props.criterion.conditions).length === 0 && this.props.criterion.conditions.constructor === Object)) {
      var condition = <span/>;
    }
    else {
      var condition = <Condition
          conditionBody = {this.props.criterion.conditions} index = {0} mode = {this.props.mode}/>;
    }
    if (this.props.criterion.description.text === store.getState().criterionObject.description.text)
    {
      var element =
        <div className={s.treeIndent + ' ' + s.criterion} onClick={() => this.handleClick(this.props.criterion)}>
          <span className="mdl-chip mdl-chip--contact mdl-color--red-400">
            <span className="mdl-chip__contact mdl-color--teal-300 mdl-color-text--white">E</span>
            <span className="mdl-chip__text">{this.props.criterion.name}</span>
          </span>
          {condition}
        </div>;
      return element;
    }
    var element =
      <div className={s.treeIndent + ' ' + s.criterion} onClick={() => this.handleClick(this.props.criterion)}>
        <span className="mdl-chip mdl-chip--contact mdl-color--green-300">
          <span className="mdl-chip__contact mdl-color--teal-300 mdl-color-text--white">E</span>
          <span className="mdl-chip__text">{this.props.criterion.name}</span>
        </span>
        {condition}
      </div>;
    return element;
  }
}

class TreeNode extends React.Component {
  constructor () {
    super();
  }

  getValue() {
    if(this.refs.conditionTree != null)
      return this.refs.conditionTree.getValue();
    return false;
  }

  render() {
    var element;

    if(this.props.mode === 'overview') {
      element =
      <div className={s.treeIndent}>
        <div>
          <span className="mdl-chip mdl-chip--contact mdl-color--green-300">
            <span className="mdl-chip__contact mdl-color--teal mdl-color-text--white">L</span>
            <span className="mdl-chip__text">{this.props.emergencyLevel}</span>
          </span>
        </div>

        <Criterion {...this.props}/>

      </div>;
    }
    else {

      element =
      <div className={s.mainTreeIndent} >
        <Condition className={s.condition}
          conditionBody = {this.props.criterion.conditions}
          index = {0}
          mode = {this.props.mode}
          ref = "conditionTree"/>
      </div>;
    }
    return element;
  }
}

class ClassifyingPage extends React.Component {
  constructor(){
    super();
    this.state = {
      mode: store.getState().mode,
      recognitionCategory: store.getState().recognitionCategory,
      emergencyLevel: store.getState().emergencyLevel,
      classificationResult: ""
    };
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
            mode={_mode}/>;
          hasCriterion = true;
          leftTree.push(treeNode);
          break;
        }
      }

    };
    return leftTree;
  }

  handleSubmit(){

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    var text;
    if(this.refs.classificationCriterion.getValue()) {
      console.log(this.refs.classificationCriterion);
     text = <p>A <b>{store.getState().recognitionCategory}</b> emergency event with emergency level <b>{store.getState().emergencyLevel}</b> has occured.</p>
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
        title: "",
        buttonText: ""
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
    return (
      <Layout className={s.content} footerLeftContent={this.getFooterContent()}>
            <div className={s.leftcontent} >
              {
                this.extractLeftPanelTree('overview').map((item, i) => {
                  return <div className={s.leftTree}><div key={i}>{item}</div><hr className={s.hr}/></div>
                })
              }
            </div>
            <div className={s.maincontent} id="mainPanel">
              <TreeNode
                emergencyLevel = {store.getState().emergencyLevel}
                criterion={store.getState().criterionObject}

                mode='classification' ref="classificationCriterion"/>

              <div>
                <DialogDemo ref="classificationDialog"/>
              </div>

            </div>
              <div className={s.descriptioncontent}>
                <spdf.SimplePDF className={s.SimplePDF}
                  file='./classification_procedures.pdf'
                  startPage={store.getState().criterionObject.description.ref.page}
                  endPage={store.getState().criterionObject.description.ref.page + store.getState().criterionObject.description.ref.range - 1}/>
              </div>
      </Layout>
    );
  }
}

export default ClassifyingPage;
