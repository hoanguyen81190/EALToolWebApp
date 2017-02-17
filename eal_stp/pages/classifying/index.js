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
import {TimerComponent} from '../../components/MDL/TimerComponent';

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
    var conditionNumber = parseInt(criterionName.replace(/[^0-9]/g,''));
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
    if(this.refs.generalEmergencyRef !== undefined) {
      this.refs.generalEmergencyRef.clearActiveCategoryCell();
    }
    if(this.refs.siteAreaEmergencyRef !== undefined) {
      this.refs.siteAreaEmergencyRef.clearActiveCategoryCell();
    }
    if(this.refs.alertRef !== undefined) {
      this.refs.alertRef.clearActiveCategoryCell();
    }
    if(this.refs.unusualEventRef !== undefined) {
      this.refs.unusualEventRef.clearActiveCategoryCell();
    }
  }

  handleSubmit(){
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    var text = "There is no emergency event";
    var currentClassificationText = "No Emergency";
    var category;
    var emergencyLevel;

    if(this.refs.generalEmergencyRef !== undefined && this.refs.generalEmergencyRef.getValue().value) {
      currentClassificationText = "General Emergency";
      text = <p>A <b>{currentClassificationText}</b> emergency event with emergency level <b>{this.refs.generalEmergencyRef.getValue().alert_level}</b> has occured.</p>;
    }

    else if(this.refs.siteAreaEmergencyRef !== undefined && this.refs.siteAreaEmergencyRef.getValue().value) {
      currentClassificationText = "Site Area Emergency";
      text = <p>A <b>{currentClassificationText}</b> emergency event with emergency level <b>{this.refs.siteAreaEmergencyRef.getValue().alert_level}</b> has occured.</p>;
    }

    else if(this.refs.alertRef !== undefined && this.refs.alertRef.getValue().value) {
      currentClassificationText = "Alert";
      text = <p>An <b>{currentClassificationText}</b> emergency event with emergency level <b>{this.refs.alertRef.getValue().alert_level}</b> has occured.</p>;
    }

    else if(this.refs.unusualEventRef !== undefined && this.refs.unusualEventRef.getValue().value) {
      currentClassificationText = "Unusual Event";
      text = <p>An <b>{currentClassificationText}</b> emergency event with emergency level <b>{this.refs.unusualEventRef.getValue().alert_level}</b> has occured.</p>;
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

  getFooterLeftContent() {
    return (
      <Button id='classSubmitButton' className={s.submitButton} type='raised' onClick={()=>{this.handleSubmit()}}>
          Submit
      </Button>
    );
  }

  getFooterRightContent() {
    return (
      <TimerComponent
        className={s.clockStyle}
        hours={0} minutes={15} seconds={0} type="decrement"/>
    );
  }

  openDocument(page, pageRange) {
    console.log("Hello");
    this.refs.pdfDocument.setState({
      startPage: page,
      endPage: (page + pageRange - 1)
    })
  }

  //TODO see if we can set the horizontal scroll of the document. Prolly need to set scroll after it has been rendered.
  scrollDocument(){
    var documentDiv = document.getElementById("descriptionContentContainer");
    if(documentDiv)
    {
      documentDiv.scrollTop = documentDiv.scrollHeight - documentDiv.clientHeight;
    }
  }

  render() {
    var stpCategories = this.extractSelectedCriterion();
    var currentClassification = "Current classification - " + this.state.currentClassification;

    return (
      <Layout className={s.content} footerLeftContent={this.getFooterLeftContent()} footerRightContent={this.getFooterRightContent()}>
          <div className= {s.recognitionCategoryText}>
            <div className={s.categoryTextWrapper}>Mode {this.state.mode} - {this.state.recognitionCategory}: {store.getState().criterionObject.name}</div>
            <TextComponent style={s.classificationTextWrapper} text={currentClassification} ref="classificationTextWrapperRef"/>

        </div>
          <div className={s.maincontent}>
            {stpCategories.map((card, index)=>{
              switch (card.recognitionCategory) {
                case "General Emergency":
                  var refName = "generalEmergencyRef";
                  break;
                case "Site Area Emergency":
                  var refName = "siteAreaEmergencyRef";
                  break;
                case "Alert":
                  var refName = "alertRef";
                  break;
                case "Unusual Event":
                  var refName = "unusualEventRef";
                  break;
                default:
              }
              return <CategoryCard
                ref={refName}
                recognitionCategory={card.recognitionCategory}
                criterion={card.criterion}
                clearAlertLevelHighlights={this.clearAlertLevelHighlights.bind(this)}
                documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
            })}
            <div>
              <DialogDemo ref="classificationDialog"/>
            </div>

            </div>
            <div className={s.descriptioncontent} id="descriptionContentContainer">
                <img className={s.documentIconRight} src={documentIcon} alt="Document icon"/>
                <spdf.SimplePDF className={s.SimplePDF}
                    file='./STP_EAL_classification_procedure.pdf'
                    startPage={27}
                    endPage={1}
                    ref="pdfDocument"
                    resizeCallback={()=> this.scrollDocument()}/>
            </div>
      </Layout>
    );
  }
}

export default ClassifyingPage;
