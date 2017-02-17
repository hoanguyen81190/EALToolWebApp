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
import {TextComponent} from '../../components/MDL/TextComponent';
import CategoryCard from './categoryCardSTP';

class ClassifyingPage extends React.Component {
  constructor(){
    super();

    this.conditionID = 0;

    var action = {
      type : 'SET_CRITERION_STATE'
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
  getCriterionConditionNumber(criterionName) {
    var conditionNumber = parseInt(criterionName.replace( /(^.+\D)(\d+)(\D.+$)/i,'$2'));
    return conditionNumber;
  }

  componentDidMount() {
    document.title = title;
  }

  extractSelectedCriterion() {
    var regCat = eALDocument.getRecognitionCategoryData(store.getState().recognitionCategory);
    var selectedCriterionNumber = this.getCriterionConditionNumber(store.getState().criterionObject.name);
    var categoryList = [];


    for(var index = 0; index < regCat.emergency_categories.length; index++) {

      var emer_cat = regCat.emergency_categories[index];
      var hasCriterion = false;
      for (var i = 0; i < emer_cat.criterions.length; i++) {
        if(this.getCriterionConditionNumber(emer_cat.criterions[i].name) === selectedCriterionNumber) {
          var treeNode = {
            'recognitionCategory': regCat.emergency_categories[index].name,
            'criterion': emer_cat.criterions[i]
          };
          hasCriterion = true;
          categoryList.push(treeNode);
          break;
        }
      }
    };
    return categoryList;
  }

  clearAlertLevelHighlights() {

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
        buttonText: "OK",
        callback: this.refs.mainPanelRef
      });
    }
    currentClassificationText = "Current Classification - " + currentClassificationText;
    this.refs.classificationTextWrapperRef.setState({text : currentClassificationText});
    // this.setState({
    //   currentClassification: currentClassificationText
    // })
  }

  getFooterContent() {
    return (
      <Button id='classSubmitButton' className={s.submitButton} type='raised' onClick={()=>{this.handleSubmit()}}>
          Submit
      </Button>
    );
  }

  render() {
    var stpCategories = this.extractSelectedCriterion();
    var currentClassification = "Current classification - " + this.state.currentClassification;

    return (
      <Layout className={s.content} footerLeftContent={this.getFooterContent()}>
          <div className= {s.recognitionCategoryText}>
            <div className={s.categoryTextWrapper}>Mode {this.state.mode} - {this.state.recognitionCategory}: {store.getState().criterionObject.name}</div>
            <TextComponent style={s.classificationTextWrapper} text={currentClassification} ref="classificationTextWrapperRef"/>
          </div>
          <div className={s.maincontent} id="mainPanel" ref="mainPanelRef">
            {stpCategories.map((card, index)=>{
              return <CategoryCard
                ref={'category'+index}
                recognitionCategory={card.recognitionCategory}
                criterion={card.criterion}
                clearAlertLevelHighlights={this.clearAlertLevelHighlights.bind(this)}
                documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
            })}
            <div>
              <DialogDemo ref="classificationDialog"/>
            </div>

            </div>

      </Layout>
    );
  }
}

export default ClassifyingPage;
