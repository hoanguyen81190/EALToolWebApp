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
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

import { title, html } from './index.md';
import store from '../../core/store';
import {eALDocument} from '../../database-loader';

import spdf from "./PDFViewer";

import DialogDemo from './dialog';

class Condition extends React.Component {
  constructor() {
    super();
    this.type = null;
    this.value = false;
    this.children = [];
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
    this.type = this.props.object.type;
    if(this.props.object.type === "Leaf") {
      if(this.props.mode === 'classification') {
        var checkbox = React.createElement('input',{type: 'checkbox', defaultChecked: false});
        var element =
        <div className={s.wrapper}>
           <input className={s.checkbox} type="checkbox" defaultChecked={false} onChange={this.handleChangeChk.bind(this)} />
           <div className={s.checkboxtext} dangerouslySetInnerHTML={{__html: this.props.object.description.text}}/>
         </div>;
        return element;
      }
      var element =
      <div>
         {checkbox}
         Condition {(this.props.index + 1)}
      </div>;
      return element;
    }
    else {

      var element =
       <div>
         {
           this.props.object.children.map((ele, index) => {
             var child = "child" + index;
             this.children.push(child);
             if((index != this.props.object.children.length - 1)) {
               return <div key={index}>

                 <Condition object = {ele} index = {index} mode = {this.props.mode} ref={child}/>
                 <div className={s.operator}>
                   <strong>{this.props.object.type}</strong>
                 </div>
               </div>;
             }
             return <div key={index}>

               <Condition object = {ele} index = {index} mode = {this.props.mode} ref={child}/>
             </div>;
           })
         }
      </div>;
      return element;
    }

  }

  // }
}

class Criterion extends React.Component {
  constructor() {
    super();
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
    this.props.callback.forceUpdate();
  }

  render() {
    if(typeof(this.props.criterion.conditions) == "undefined" ||
        (Object.keys(this.props.criterion.conditions).length === 0 && this.props.criterion.conditions.constructor === Object)) {
      var condition = <div/>;
    }
    else {
      var condition = <Condition
          object = {this.props.criterion.conditions} index = {0} mode = {this.props.mode}/>;
    }
    var element =
    <div className={s.box} onClick={() => this.handleClick(this.props.criterion)}>
      {
        this.props.criterion.name
      }
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
      <div>
        <div>
          {this.props.emergencyLevel}
        </div>

        <Criterion criterion={this.props.criterion}
          mode = {this.props.mode}
          callback={this.props.callback}
          emergencyLevel={this.props.emergencyLevel}/>
      </div>;
    }
    else {

      element =

      <div className={s.table}>
        <Condition object = {this.props.criterion.conditions} index = {0} mode = {this.props.mode} ref = "conditionTree"/>
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


    var text;
    if(this.refs.classificationCriterion.getValue()) {
     text = "It is likely that an " + store.getState().recognitionCategory + " event with "
      +  store.getState().emergencyLevel + " level has happened";
    }
    else {
     text = "It is likely that there is no emergency event";
    }

    this.refs.classificationDialog.setState({
      openDialog: true,
      content: text,
      title: "",
      buttonText: ""
    });

    console.log("button pressed");
  }

  render() {
    //console.log(this.refs);
    //var criterionValue = this.refs.classificationCriterion.getValue();
    console.log(this.refs.classificationCriterion);
    return (
      <Layout className={s.content}>

            <div className={s.leftcontent} >
              {
                this.extractLeftPanelTree('overview').map((item, i) => {
                  return <div key={i}>{item}</div>
                })
              }
            </div>
            <div className={s.maincontent} id="mainPanel">
              <TreeNode
                emergencyLevel = {store.getState().emergencyLevel}
                criterion={store.getState().criterionObject}

                mode='classification' ref="classificationCriterion"/>

              <Button className={s.submit_button} type='raised' onClick={()=>{this.handleSubmit()}}>
                  Submit
              </Button>

              <div className={s.submitButton}>
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
