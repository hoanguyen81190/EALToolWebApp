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

  }

  render() {
    return (
      <Layout className={s.content}>
        <div className= {s.recognitionCategoryText}> Fission Product Barrier Matrix - Mode {this.state.mode}</div>
          <div className={s.maincontent}>
            {eALDocument.data.fission_product_barriers.map((barrier, index) => {
              return <div className={s.tableWrapper}>
                        <BarrierTable barrier={barrier} key={index}/>
                     </div>;
            })}

            <Button className={s.submit_button} type='raised' onClick={()=>{this.handleSubmit()}}>
                Submit
            </Button>

            <div className={s.submitButton}>
              <DialogDemo ref="classificationDialog"/>
            </div>

        </div>

        <div className={s.descriptioncontent}>
            <spdf.SimplePDF className={s.SimplePDF}
                file='./classification_procedures.pdf'
                startPage={27}
                endPage={28}/>
        </div>


      </Layout>
    );
  }
}

export default BarrierMatrixPage;
