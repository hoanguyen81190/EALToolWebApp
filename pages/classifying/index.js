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
    this.children.map((item) => {children.push(this.refs[item])})
    switch (this.type) {
      case 'OR':
        return children.reduce((a, b) => a.getValue() | b.getValue());
        break;
      case 'AND':
        return children.reduce((a, b) => a.getValue() & b.getValue());
      case 'XOR':
        return children.reduce((a, b) => a.getValue() ^ b.getValue());
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
             if((index != this.props.object.children.length - 1)) {
               return <div key={index}>
                 <Condition object = {ele} index = {index} mode = {this.props.mode}/>
                 <div className={s.operator}>
                   <strong>{this.props.object.type}</strong>
                 </div>
               </div>;
             }
             var child = "child" + index;
             this.children.push(child);
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
  }

  render() {
    var element =
    <div className={s.box} onClick={() => this.handleClick(this.props.criterion)}>
      {
        this.props.criterion.name
      }
      <Condition
        object = {this.props.criterion.conditions} index = {0} mode = {this.props.mode} />
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
        <Criterion criterion={this.props.criterion} mode = {this.props.mode}/>
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
      category: store.getState().category
    };
  }

  componentDidMount() {
    document.title = title;
  }

  extractLeftPanelTree(_mode) {

    var regCat = eALDocument.getRecognitionCategoryData(store.getState().category);
    var leftTree = [];

    for(var index = 0; index < regCat.emergency_categories.length; index++) {
      var emer_cat = regCat.emergency_categories[index];
      var hasCriterion = false;
      for (var i = 0; i < emer_cat.criterions.length; i++) {
        if(emer_cat.criterions[i].name === store.getState().object.name) {
          var treeNode = <TreeNode key={leftTree.length}
            emergencyLevel={emer_cat.name}
            criterion={emer_cat.criterions[i]}
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
    console.log(this.refs.classificationCriterion.getValue());
  }

  render() {
    return (
      <Layout className={s.content}>
            <div className={s.leftcontent}>
              {
                this.extractLeftPanelTree('overview').map((item) => {
                  return <div>{item}</div>
                })
              }
            </div>
            <div className={s.maincontent}>
              <TreeNode
                emergencyLevel = {store.getState().level}
                criterion={store.getState().object}
                mode='classification' ref="classificationCriterion"/>

              <Button className={s.submit_button} type='raised' onClick={()=>{this.handleSubmit()}}>
                  Submit
              </Button>
            </div>
              <div className={s.descriptioncontent}>
                  <ul id="description">
                      <li>right</li>
                      <li>right</li>
                  </ul>
              </div>

      </Layout>
    );
  }

}

export default ClassifyingPage;
