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
import spdf from "./PDFViewer";
import DialogDemo from './dialog';

import { title, html } from './index.md';
import store from '../../core/store';

import BarrierTable from './barrierTable';
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
    var fuel = this.refs.fuel.getValue();
    var RCS = this.refs.RCS.getValue();
    var containment = this.refs.containment.getValue();
    //calculate emergencyLevel

    //General emergency
    //naive code
    if((fuel.loss && RCS.loss && containment.potential_loss) ||
        (fuel.loss && containment.loss && RCS.potential_loss) ||
          (RCS.loss && containment.loss && fuel.potential_loss)) {
      return ('General Emergency');
    }

    //Site area emergency
    var first = fuel.loss || fuel.potential_loss;
    var second = RCS.loss || RCS.potential_loss;
    var third = containment.loss;
    //naive code
    if((first && second) ||
        (first && third) ||
          (second && third)) {
      return ('Site Area Emergency');
    }

    //alert
    if(fuel.loss || fuel.potential_loss || RCS.loss || RCS.potential_loss) {
      return ('Alert');
    }

    //unusual event
    if(containment.loss || containment.potential_loss) {
      return ('Unusual Event');
    }
    return ('None');
  }

  handleSubmit() {
    var emergencyLevel = this.calculateEmergencyLevel();
    if(emergencyLevel === 'None')
    {
      var text = "It is likely that there is no emergency event";
    }
    else {
      var text = "It is likely that an event with "
       +  emergencyLevel + " level has happened";
    }

    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

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

  openDocument(page, pageRange) {
    this.refs.pdfDocument.setState({
      startPage: page,
      endPage: (page + pageRange - 1)
    })

    this.refs.pdfDocument.forceUpdate();
  }

  getFooterContent() {
    return (
      <Button className={s.submitButton} type='raised' onClick={()=>this.handleSubmit()}>
          Submit
      </Button>
    );
  }

  render() {
    return (
      <Layout className={s.content} footerLeftContent={this.getFooterContent()}>
        <div className= {s.recognitionCategoryText}> Fission Product Barrier Matrix - Mode {this.state.mode}</div>
          <div className={s.maincontent}>
            <div className={s.tableWrapper}>
            <BarrierTable barrier={eALDocument.data.fission_product_barriers[0]} ref="fuel" documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
            <BarrierTable barrier={eALDocument.data.fission_product_barriers[1]} ref="RCS" documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
            <BarrierTable barrier={eALDocument.data.fission_product_barriers[2]} ref="containment" documentCallback={(startPage, pageRange)=> this.openDocument(startPage, pageRange)}/>
            </div>
            <div>
              <DialogDemo ref="classificationDialog"/>
            </div>

        </div>

        <div className={s.descriptioncontent}>
            <spdf.SimplePDF className={s.SimplePDF}
                file='./classification_procedures.pdf'
                startPage={27}
                endPage={1} ref="pdfDocument"/>
        </div>


      </Layout>
    );
  }
}

export default BarrierMatrixPage;
