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

  handleSubmit() {
    var fuel = this.refs.fuel.getValue();
    var RCS = this.refs.RCS.getValue();
    var containment = this.refs.containment.getValue();
    //calculate emergencyLevel
    //General emergency

  }

  openDocument(page, pageRange) {
    this.refs.pdfDocument.setState({
      startPage: page,
      endPage: (page + pageRange - 1)
    })

    this.refs.pdfDocument.forceUpdate();
  }

  render() {
    return (
      <Layout className={s.content}>
        <div className= {s.recognitionCategoryText}> Fission Product Barrier Matrix - Mode {this.state.mode}</div>
          <div className={s.maincontent}>
            <div className={s.tableWrapper}>
            <BarrierTable barrier={eALDocument.data.fission_product_barriers[0]} ref="fuel" documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
            <BarrierTable barrier={eALDocument.data.fission_product_barriers[1]} ref="RCS" documentCallback={(startPage, pageRange) => this.openDocument(startPage, pageRange)}/>
            <BarrierTable barrier={eALDocument.data.fission_product_barriers[2]} ref="containment" documentCallback={(startPage, pageRange)=> this.openDocument(startPage, pageRange)}/>
            </div>
            <Button className={s.submitButton} type='raised' onClick={()=>{this.handleSubmit()}}>
                Submit
            </Button>

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
