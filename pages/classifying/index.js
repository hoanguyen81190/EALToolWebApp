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
        console.log("default");
        return false;
    }
  }

  render() {
    this.type = this.props.conditionBody.type;
    if(this.props.conditionBody.type === "Leaf") {
      var element;
      if(this.props.mode === 'classification') { /* Main Content Panel */
        element =
        //<div  className={s.treeIndent + ' ' + s.conditionleaf}>
        <li className={s.treeIndent}>
           <input type="checkbox" defaultChecked={false} onChange={this.handleChangeChk.bind(this)} />
           <span  dangerouslySetInnerHTML={{__html: this.props.conditionBody.description.text}}/>
         </li>
         //</div>;
      }
      else{ /* Overview Panel */
        element =
        //<li><a href="#">Condition {(this.props.index + 1)}</a></li>;
        //<div className={s.treeIndent + ' ' + s.conditionleaf}>
          <li className={s.treeIndent }><span className={`mdl-chip mdl-chip--contact mdl-color--green-300 ${s.leafHover}`} >
            <span className={`mdl-chip__contact mdl-color--cyan-900 mdl-color-text--white `}>C</span>
            <span className={`mdl-chip__text `}>Condition {(this.props.index + 1)}</span>
          </span></li>;
        //</li>;
        //</div>
      }

      return element;
    }
    else {
      var element;
      if(this.props.mode === 'classification') { /* Main Content Panel */
        element =
        <ul className={s.firstUL}>
        <li className={s.treeIndent }>
           <ul>
             {
               this.props.conditionBody.children.map((ele, index) => {
                 var child = "child" + index;
                 this.children.push(child);

                 var element;


                 if(index != this.props.conditionBody.children.length-1) /* Condition + Operator */
                 {
                   element =  <li className={s.test}>
                                 <ul>
                                   <Condition conditionBody = {ele} index = {index} mode = {this.props.mode} key={index} ref={child}/>
                                 </ul>

                                <span className={`mdl-chip mdl-chip--contact mdl-color--green-300`} >
                                 <span className={`mdl-chip__contact mdl-color--deep-purple-500 mdl-color-text--white `}>L</span>
                                 <span className={`mdl-chip__text`}>{this.props.conditionBody.type}</span>
                               </span>
                             </li>;
                 }
                 else{ /* For the last element we only add the condition */
                   element = <li className={s.test}>
                                 <ul><Condition conditionBody = {ele} index = {index} mode = {this.props.mode} key={index} ref={child}/>
                               </ul>
                             </li>;
                 }

                 return element;
               })
             }
           </ul>
         </li>
        </ul>;
      }
      else{ /* Overview Panel */
        element =
        <ul className={s.firstUL}>
        <li className={s.treeIndent }><span className={`mdl-chip mdl-chip--contact mdl-color--green-300 ${s.leafHover}`} >
          <span className={`mdl-chip__contact mdl-color--deep-purple-500 mdl-color-text--white `}>L</span>
          <span className={`mdl-chip__text`}>{this.props.conditionBody.type}</span>
        </span>
           <ul>
             {
               this.props.conditionBody.children.map((ele, index) => {
                 var child = "child" + index;
                 this.children.push(child);
                 return <Condition conditionBody = {ele} index = {index} mode = {this.props.mode} key={index} ref={child}/>;
               })
             }
           </ul>
         </li>
        </ul>;
      }
      return element;
    }
  }
}

class Criterion extends React.Component {
  constructor() {
    super();
  }

  getValue() {
    if(this.refs.conditionTree != null)
      return this.refs.conditionTree.getValue();
    return false;
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
    var condition;
    if(typeof(this.props.criterion.conditions) == "undefined" ||
        (Object.keys(this.props.criterion.conditions).length === 0 && this.props.criterion.conditions.constructor === Object)) {
      condition = <span/>;
    }
    else {
      if(this.props.mode === "overview"){
        condition = <Condition
            conditionBody = {this.props.criterion.conditions} index = {0} mode = {this.props.mode}/>;
      }
      else{
        condition = <Condition className={s.condition}
                      conditionBody = {this.props.criterion.conditions}
                      index = {0}
                      mode = {this.props.mode}
                      ref = "conditionTree"
                    />
      }
    }

    var element;
    if (this.props.criterion.description.text === store.getState().criterionObject.description.text)
    {
      if(this.props.mode === "overview"){ /* Overview Panel - Selected criterion */
        element =
          <div className={s.treeIndent + ' ' + s.criterion} onClick={() => this.handleClick(this.props.criterion)}>
            <span className="mdl-chip mdl-chip--contact mdl-color--red-400">
              <span className="mdl-chip__contact mdl-color--green-900 mdl-color-text--white">E</span>
              <span className="mdl-chip__text">{this.props.criterion.name}</span>
            </span>
            {condition}
          </div>;
      }
      else{ /* Main Content Panel */
        element =
          <div className={s.treeIndent} >
            <span className="mdl-chip mdl-chip--contact mdl-color--red-400">
              <span className="mdl-chip__contact mdl-color--green-900 mdl-color-text--white">E</span>
              <span className="mdl-chip__text">{this.props.criterion.name}</span>
            </span>
            {condition}
          </div>;
      }
    }
    else{ /* Overview Panel - Not selected */
      element =
        <div className={s.treeIndent + ' ' + s.criterion} onClick={() => this.handleClick(this.props.criterion)}>
          <span className="mdl-chip mdl-chip--contact mdl-color--green-300">
            <span className="mdl-chip__contact mdl-color--green-900 mdl-color-text--white">E</span>
            <span className="mdl-chip__text">{this.props.criterion.name}</span>
          </span>
            {condition}
        </div>;
    }

    return element;
  }
}

class TreeNode extends React.Component {
  constructor () {
    super();
  }

  getValue() {
    if(this.refs.criterionResult != null)
      return this.refs.criterionResult.getValue();
    return false;
  }

  render() {
    var element;

    if(this.props.mode === 'overview') { /* Overview Panel */
      element =
      <div className={s.treeIndent}>
        <div>
          <span className="mdl-chip mdl-chip--contact mdl-color--green-300">
            <span className="mdl-chip__contact mdl-color--orange-900 mdl-color-text--white">EL</span>
            <span className="mdl-chip__text">{this.props.emergencyLevel}</span>
          </span>
        </div>
        <Criterion {...this.props}/>
      </div>;
    }
    else {  /* Main Content Panel */
      element =
      <div className={s.treeIndent}>
          <span className="mdl-chip mdl-chip--contact mdl-color--green-300">
            <span className="mdl-chip__contact mdl-color--orange-900 mdl-color-text--white">EL</span>
            <span className="mdl-chip__text">{this.props.emergencyLevel}</span>
          </span>
        <Criterion {...this.props} ref="criterionResult"/>
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
    return (
      <Layout className={s.content} footerLeftContent={this.getFooterContent()}>
            <div className={s.leftcontent} >
              {
                this.extractLeftPanelTree('overview').map((item, i) => {
                  return <div className={s.leftTree}><div className={s.overviewTree} key={i}>{item}</div><hr className={s.hr}/></div>
                })
              }
            </div>
            <div className={s.maincontent} id="mainPanel">
              <div className = {s.contentTree}>
                <TreeNode
                  emergencyLevel = {store.getState().emergencyLevel}
                  criterion={store.getState().criterionObject}

                  mode='classification' ref="classificationCriterion"/>
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
