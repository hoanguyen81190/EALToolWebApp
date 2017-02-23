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

import {TreeChip, TreeCard, ResetButton} from '../../components/MDL/CustomMDLComponents';
import {TextComponent} from '../../components/MDL/TextComponent';

import resetIcon from '../../resources/reset_icon.png';

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
    this.scrollCardIntoView();
    this.calculateEmergencyLevel();
  }

  componentWillUpdate() {
    this.calculateEmergencyLevel();
  }

  scrollCardIntoView() {
    var EmergencyCardElement;
    switch (this.state.emergencyLevel) {
      case "General Emergency":
        EmergencyCardElement = document.getElementById("GEBarrierCard");
        break;
      case "Site Area Emergency":
        EmergencyCardElement = document.getElementById("SABarrierCard");
        break;
      case "Alert":
        EmergencyCardElement = document.getElementById("ABarrierCard");
        break;
      case "Unusual Event":
        EmergencyCardElement = document.getElementById("UEBarrierCard");
        break;
      }
      EmergencyCardElement.scrollIntoView();

      if(this.state.emergencyLevel !== "Unusual Event"){
        var MainContentDIV = document.getElementById("maincontentId");
        MainContentDIV.scrollTop = MainContentDIV.scrollTop - 50;
      }
  }

  extractSelectedCriterions() {
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

  calculateEmergencyLevel() {
    var text = "There is no emergency event";
    var currentClassificationText = "No Emergency";
    var category;
    var emergencyLevel;

    var classificationHappened = false;

    if(this.refs.generalEmergencyRef !== undefined && this.refs.generalEmergencyRef.getValue().value) {
      classificationHappened = true;
      currentClassificationText = "General Emergency";
      emergencyLevel = this.refs.generalEmergencyRef.getValue().alert_level;
    }

    else if(this.refs.siteAreaEmergencyRef !== undefined && this.refs.siteAreaEmergencyRef.getValue().value) {
      classificationHappened = true;
      currentClassificationText = "Site Area Emergency";
      emergencyLevel = this.refs.siteAreaEmergencyRef.getValue().alert_level;
    }

    else if(this.refs.alertRef !== undefined && this.refs.alertRef.getValue().value) {
      classificationHappened = true;
      currentClassificationText = "Alert";
      emergencyLevel = this.refs.alertRef.getValue().alert_level;
    }

    else if(this.refs.unusualEventRef !== undefined && this.refs.unusualEventRef.getValue().value) {
      classificationHappened = true;
      currentClassificationText = "Unusual Event";
      emergencyLevel = this.refs.unusualEventRef.getValue().alert_level;
    }

    if(classificationHappened){
      var lvltext = "";
      emergencyLevel.map((lvl, ind) => {
        if(emergencyLevel.length === 1) {
          lvltext = lvl;
        }
        else if(ind === emergencyLevel.length - 1 && ind !== 0) {
          lvltext += " and " + lvl;
        }
        else if(ind === emergencyLevel.length - 2){
          lvltext += lvl;
        }
        else{
          lvltext += lvl + ", ";
        }
      })
      text = <p>A <b>{currentClassificationText}</b> emergency event with <b>{lvltext}</b> has occured in <b>Mode {store.getState().mode}</b> in the <b>{store.getState().recognitionCategory}</b> category</p>;
    }

    var actionSetHighestClassification = {
      type: 'SET_HIGHEST_CLASSIFICATION',
      highestClassification: currentClassificationText
    }
    store.dispatch(actionSetHighestClassification);

    currentClassificationText = "Current Classification - " + currentClassificationText;
    this.refs.classificationTextWrapperRef.setState({text : currentClassificationText});
    return text;
  }

  handleSubmit(){
    this.refs.LayoutRef.getFooterRef().getClockRef().resetTimer();

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    var text = this.calculateEmergencyLevel();

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

    this.refs.LayoutRef.getFooterRef().updateEAL();
  }

  onClickReset() {
    var stpCategories = this.extractSelectedCriterions();
    stpCategories.map((item, index) => {
      eALDocument.resetCriterion(item.criterion);
    });

    this.forceUpdate();
  }

  getFooterRightContent() {
    return(
      <ResetButton onClickCallBack={()=>this.onClickReset()} />
    );
  }

  getFooterLeftContent() {
    return (
      <Button id='classSubmitButton' className={s.submitButton} type='raised' onClick={()=>{this.handleSubmit()}}>
          Evaluate
      </Button>
    );
  }

  openDocument(page, pageRange) {
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
    var stpCategories = this.extractSelectedCriterions();
    var currentClassification = "Current EAL - " + this.state.currentClassification;

    return (
      <Layout ref="LayoutRef" className={s.content} footerLeftContent={this.getFooterLeftContent()} footerRightContent={this.getFooterRightContent()}>
          <div className= {s.recognitionCategoryText}>
            <div className={s.categoryTextWrapper}>Mode {this.state.mode} - {this.state.recognitionCategory} <span className={s.categoryArrow}>&rarr;</span></div>
            <TextComponent style={s.classificationTextWrapper} text={currentClassification} ref="classificationTextWrapperRef"/>
          </div>
          <div id="maincontentId" className={s.maincontent}>
            {stpCategories.map((card, index)=>{
              var refName = "";
              var cardId = "";
              switch (card.recognitionCategory) {
                case "General Emergency":
                  refName = "generalEmergencyRef";
                  cardId = "GEBarrierCard";
                  break;
                case "Site Area Emergency":
                  refName = "siteAreaEmergencyRef";
                  cardId = "SABarrierCard";
                  break;
                case "Alert":
                  refName = "alertRef";
                  cardId = "ABarrierCard";
                  break;
                case "Unusual Event":
                  refName = "unusualEventRef";
                  cardId = "UEBarrierCard";
                  break;
                default:
              }
              return <CategoryCard
                ref={refName}
                cardID = {cardId}
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
