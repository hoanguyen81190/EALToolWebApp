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
import Layout from '../../components/Layout';
import Button from '../../components/Button';

import s from './styles.css';

import { title, html } from './index.md';
import store from '../../core/store';
import {eALDocument} from '../../database-loader';

import spdf from "./PDFViewer";

class Condition extends React.Component {
  render() {
    if(this.props.mode === 'classification')
    {
      return <div></div>
    }
    else {

    if(this.props.object.type === "Leaf") {
      var element =
      <div>
         Condition {(this.props.index + 1)}
      </div>;
      return element;
    }
    else {
      var element =
       <div>
         {
           this.props.object.children.map((ele, index) => {
             if(index != this.props.object.children.length - 1) {
               return <div key={index}>
                 <Condition object = {ele} index = {index}/>
                 <div>
                   {this.props.object.type}
                 </div>
               </div>;
             }
             return <div key={index}>
               <Condition object = {ele} index = {index}/>
             </div>;
           })
         }
      </div>;
      return element;
    }

  }
  }
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
        object = {this.props.criterion.conditions} index = {0} mode = 'classification'/>
    </div>;
    return element;
  }
}

class TreeNode extends React.Component {
  constructor () {
    super();
  }
  render() {
    var element;
    console.log(this.props.mode);
    if(this.props.mode === 'overview') {
      element =
      <div>
        <div>
          {this.props.emergencyLevel}
        </div>
        <Criterion criterion={this.props.criterion}/>
      </div>;
    }
    else {
      var checkbox = React.createElement('input',{type: 'checkbox', defaultChecked: false});
      element =
      <div>
        {checkbox}
        <Condition object = {this.props.criterion.conditions} index = {0}/>
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
      category: store.getState().category,
    }
  }

  // static propTypes = {
  //   articles: PropTypes.array.isRequired,
  // };

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
      // if (!hasCriterion) {
      //   var treeNode = {
      //     category : emer_cat.name,
      //     criterion : null
      //   };
      //   leftTree.push(treeNode);
      // }
    };
    return leftTree;
  }

  // extractCriterion(criterion, _mode) {
  //   for (var i = 0; i < criterion.conditions; i++) {
  //       var treeNode = <TreeNode key={leftTree.length}
  //         category={emer_cat.name}
  //         criterion={emer_cat.criterions[i]}
  //         mode={_mode}/>;
  //       hasCriterion = true;
  //   }
  // }

  render() {

    return (
      <Layout className={s.content}>
            <div className={s.leftcontent} >
              {
                this.extractLeftPanelTree('overview').map((item, i) => {
                  return <div key={i}>{item}</div>
                })
              }
            </div>
            <div className={s.maincontent}>
              <TreeNode
                emergencyLevel = {store.getState().level}
                criterion={store.getState().object}
                mode='classification'/>

              <Button className={s.submit_button} type='raised'>
                  Submit
              </Button>
            </div>
              <div className={s.descriptioncontent}>
                <spdf.SimplePDF className={s.SimplePDF} file='./classification_procedures.pdf' startPage={3} endPage={4}/>
              </div>
      </Layout>
    );
  }

}

export default ClassifyingPage;
