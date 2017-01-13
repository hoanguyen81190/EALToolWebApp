import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

import s from './styles.css';
import spdf from "./PDFViewer";
import DialogDemo from './dialog';

import { title, html } from './index.md';
import store from '../../core/store';

import BarrierTable from './barrierTable';
import BarrierTableNew from './barrierTableNew';
import {eALDocument} from '../../database-loader';

class BarrierMatrixPage extends React.Component {
  constructor(){
    super();
    this.state = {
      mode: store.getState().mode,
      recognitionCategory: store.getState().recognitionCategory
    }
  }

  componentDidMount() {
    document.title = title;
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

    var barrierStatus = <p><ul>{fuelText}{rcsText}{containmentText}</ul></p>;
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

  handleSubmit() {
    var emergencyResult = this.calculateEmergencyLevel();
    if(emergencyResult === 'None')
    {
      var text = "There is no emergency";
    }
    else {
      var text = <p>A Fission Product Barrier Matrix emergency with classification <b>{emergencyResult.emergencyLevel}</b> has occured. <br/><br/>Barrier status:<br/> {emergencyResult.barrierStatus}</p>;
    }

    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    if(isIE || isEdge)
    {
      text = "A Fission Product Barrier Matrix emergency with classification " + emergencyResult.emergencyLevel + " has occured." ;
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

  openDocument(page, pageRange) {
    this.refs.pdfDocument.setState({
      startPage: page,
      endPage: (page + pageRange - 1)
    })


  }

  getFooterContent() {
    return (
      <Button className={s.submitButton} type='raised' onClick={()=>this.handleSubmit()}>
          Submit
      </Button>
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

    var oldBarriers = <div className={s.tableWrapper}><BarrierTable barrier={eALDocument.data.fission_product_barriers[0]} ref="fuel"        clearBarrierHighights={this.clearBarrierHighlights.bind(this)} documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
    <BarrierTable barrier={eALDocument.data.fission_product_barriers[1]} ref="RCS"         clearBarrierHighights={this.clearBarrierHighlights.bind(this)} documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
    <BarrierTable barrier={eALDocument.data.fission_product_barriers[2]} ref="containment" clearBarrierHighights={this.clearBarrierHighlights.bind(this)} documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
  </div>;

    var newBarriers = <div className={s.tableWrapper}><BarrierTableNew barrier={eALDocument.data.fission_product_barriers[0]} ref="fuel"        clearBarrierHighights={this.clearBarrierHighlights.bind(this)} documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
    <BarrierTableNew barrier={eALDocument.data.fission_product_barriers[1]} ref="RCS"        clearBarrierHighights={this.clearBarrierHighlights.bind(this)} documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
    <BarrierTableNew barrier={eALDocument.data.fission_product_barriers[2]} ref="containment"        clearBarrierHighights={this.clearBarrierHighlights.bind(this)} documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
  </div>;

    return (
      <Layout className={s.content} footerLeftContent={this.getFooterContent()}>
        <div className= {s.recognitionCategoryText}> Fission Product Barrier Matrix - Mode {this.state.mode}</div>
          <div className={s.maincontent}>

              {newBarriers}

            <div>
              <DialogDemo ref="classificationDialog"/>
            </div>
        </div>

        <div className={`${s.descriptioncontent}`} id="descriptionContentContainer">
            <spdf.SimplePDF className={s.SimplePDF}
                file='./classification_procedures.pdf'
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
