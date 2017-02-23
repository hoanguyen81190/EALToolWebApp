import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

import documentIcon from '../../resources/Document-50.png';

import s from './styles.css';
import spdf from "./PDFViewer";
import DialogDemo from './dialog';

import { title, html } from './index.md';
import store from '../../core/store';

import BarrierCard from './barrierTableSTP';

import {eALDocument} from '../../database-loader';

import {TextComponent} from '../../components/MDL/TextComponent';
import {TimerComponent} from '../../components/MDL/TimerComponent';
import {ResetButton} from '../../components/MDL/CustomMDLComponents';

import resetIcon from '../../resources/reset_icon.png';

class BarrierMatrixPage extends React.Component {
  constructor(){
    super();
    this.state = {
      mode: store.getState().mode,
      recognitionCategory: store.getState().recognitionCategory,
      currentClassification: "No Emergency"
    }
  }

  componentDidMount() {
    document.title = title;
    this.calculateEmergencyLevelText();
  }

  componentWillUpdate() {
    this.calculateEmergencyLevelText();
  }

  calculateEmergencyLevel() {
    var result = {
      emergencyLevel: null,
      barrierStatus: null,
      prefix: null
    }

    var fuelBarrierStatus = this.refs.fuel.getValue();
    var rcsBarrierStatus = this.refs.RCS.getValue();
    var containmentBarrierStatus = this.refs.containment.getValue();

    var nmbLoss = 0;
    var nmbPotLoss = 0;

    var fuelText = "";
    var rcsText = "";
    var containmentText = "";

    if(fuelBarrierStatus.loss){
      fuelText = <li>Fuel Clad Barrier - Lost</li>;
      nmbLoss++;
    }
    else if(fuelBarrierStatus.potential_loss){
      fuelText = <li>Fuel Clad Barrier - Potential Loss</li>;
      nmbPotLoss++;
    }

    if(rcsBarrierStatus.loss)
    {
      rcsText = <li>RCS Barrier - Lost</li>;
      nmbLoss++;
    }
    else if(rcsBarrierStatus.potential_loss)
    {
      rcsText = <li>RCS Barrier - Potential Loss</li>;
      nmbPotLoss++;
    }

    if(containmentBarrierStatus.loss)
    {
      containmentText = <li>Containment Barrier - Lost</li>;
      nmbLoss++;
    }
    else if(containmentBarrierStatus.potential_loss)
    {
      containmentText = <li>Containment Barrier - Potential Loss</li>;
      nmbPotLoss++;
    }

    var barrierStatus = <ul>{fuelText}{rcsText}{containmentText}</ul>;
    result.barrierStatus = barrierStatus;

    //calculate emergencyLevel
    //General emergency - Loss of TWO Fission Product Barriers AND Potential Loss of Third Barrier.
    if(nmbLoss === 3 || (nmbLoss === 2 && nmbPotLoss === 1)){
      result.prefix = "A";
      result.emergencyLevel = "General Emergency";
      return(result);
    }

    //Site area emergency - Any TWO of the Following:
      //1. Loss or Potential Loss of Fuel Clad
      //2. Loss or Potential Loss of RCS
      //3. Loss of Containment Barrier

    var first = fuelBarrierStatus.loss || fuelBarrierStatus.potential_loss;
    var second = rcsBarrierStatus.loss || rcsBarrierStatus.potential_loss;
    var third = containmentBarrierStatus.loss;

    if((first && second) ||
        (first && third) ||
          (second && third)) {
            result.prefix = "A";
            result.emergencyLevel = "Site Area Emergency";
      return (result);
    }

    //Alert - Loss or Potential Loss of either Fuel Clad or RCS Barrier
    if(fuelBarrierStatus.loss || fuelBarrierStatus.potential_loss || rcsBarrierStatus.loss || rcsBarrierStatus.potential_loss) {
      result.prefix = "An";
      result.emergencyLevel = "Alert";
      return (result);
    }

    //Unusual Event - Loss or Potential loss of Containment Barrier
    if(containmentBarrierStatus.loss || containmentBarrierStatus.potential_loss) {
      result.prefix = "An";
      result.emergencyLevel = "Unusual Event";
      return (result);
    }
    return ('None');
  }

  calculateEmergencyLevelText() {
    var emergencyResult = this.calculateEmergencyLevel();
    var currentClassificationText;
    if(emergencyResult === 'None') {
      currentClassificationText = "No Emergency";
    }
    else {
      currentClassificationText = emergencyResult.emergencyLevel;
    }

    currentClassificationText = "Current Classification - " + currentClassificationText;
    this.refs.classificationTextWrapperRef.setState({text : currentClassificationText});
  }

  handleSubmit() {
    this.refs.LayoutRef.getFooterRef().getClockRef().resetTimer();

    var emergencyResult = this.calculateEmergencyLevel();
    var currentClassificationText;
    if(emergencyResult === 'None')
    {
      currentClassificationText = "No Emergency";
      var text = "There is no emergency";
    }
    else {
      currentClassificationText = emergencyResult.emergencyLevel;
      var text = <p>A Fission Product Barrier Matrix emergency with <b>EAL-{emergencyResult.emergencyLevel}</b> has occured. <br/><br/>Barrier status:<br/> {emergencyResult.barrierStatus}</p>;
    }

    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    if(isIE || isEdge)
    {
      text = <p>A Fission Product Barrier Matrix emergency with classification {emergencyResult.emergencyLevel} has occured.</p>
      alert(text);
    }
    else
    {
      this.refs.classificationDialog.setState({
        openDialog: true,
        content: text,
        title: "Evaluation Result",
        buttonText: "OK",
        callback: this
      });
    }

    this.refs.classificationTextWrapperRef.setState({text : "Current EAL - " + currentClassificationText});

    var actionSetHighestClassification = {
      type: 'SET_HIGHEST_CLASSIFICATION',
      highestClassification: currentClassificationText
    }
    store.dispatch(actionSetHighestClassification);
    this.refs.LayoutRef.getFooterRef().updateEAL();

    eALDocument.logEvent({type: 'barrier',
      eal: currentClassificationText,
      category: "Barrier products",
      mode: store.getState().mode});
  }

  openDocument(page, pageRange) {
    this.refs.pdfDocument.setState({
      startPage: page,
      endPage: (page + pageRange - 1)
    })
  }

  getFooterContent() {
    return (
      <Button className={s.submitButton} type='raised' onClick={()=>this.handleSubmit()}>
          Evaluate
      </Button>
    );
  }

  onClickReset() {
    eALDocument.resetFissionProductBarriers(store.getState().mode);
    this.forceUpdate();
  }

  getFooterRightContent() {
    return(
      <ResetButton type='icon' onClickCallBack={()=>this.onClickReset()} buttonText="Reset Page"/>
    );
  }

  //TODO see if we can set the horizontal scroll of the document. Prolly need to set scroll after it has been rendered.
  scrollDocument(){
    var documentDiv = document.getElementById("descriptionContentContainer");
    if(documentDiv)
    {
      documentDiv.scrollTop = documentDiv.scrollHeight - documentDiv.clientHeight;
    }
  }

  clearBarrierHighlights(){
    this.refs.fuel.clearActiveBarrierCell();
    this.refs.RCS.clearActiveBarrierCell();
    this.refs.containment.clearActiveBarrierCell();
  }

  render() {
    var stpBarriers = <div><BarrierCard barrier={eALDocument.data.fission_product_barriers[0]} ref="fuel" clearBarrierHighights={this.clearBarrierHighlights.bind(this)} documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
      <BarrierCard barrier={eALDocument.data.fission_product_barriers[1]} ref="RCS" clearBarrierHighights={this.clearBarrierHighlights.bind(this)}  documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
      <BarrierCard barrier={eALDocument.data.fission_product_barriers[2]} ref="containment" clearBarrierHighights={this.clearBarrierHighlights.bind(this)}  documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
    </div>;

    var currentClassification = "Current EAL - " + this.state.currentClassification;

    return (
      <Layout ref="LayoutRef" className={s.content} footerLeftContent={this.getFooterContent()} footerRightContent={this.getFooterRightContent()}>
        <div className= {s.recognitionCategoryText}>
          <div className={s.categoryTextWrapper}>Mode {this.state.mode} - Fission Product Barrier Matrix <span className={s.categoryArrow}>&rarr;</span></div>
          <TextComponent style={s.classificationTextWrapper} text={currentClassification} ref="classificationTextWrapperRef"/>
        </div>
        <div className={s.maincontent}>
              {stpBarriers}
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

export default BarrierMatrixPage;
