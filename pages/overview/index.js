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

import OverviewTable from './overviewGrid';

class OverviewPage extends React.Component {
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

  render() {
    //<div className= {s.recognitionCategoryText}> {this.state.recognitionCategory} - Mode {this.state.mode}</div>
    return (
      <Layout className={s.content}>
        <div className= {s.recognitionCategoryText}> {this.state.recognitionCategory} - Mode {this.state.mode}</div>
        <div className={s.tableWrapper}>
          <OverviewTable />
        </div>
        {
      }
      </Layout>
    );
  }
}

export default OverviewPage;
