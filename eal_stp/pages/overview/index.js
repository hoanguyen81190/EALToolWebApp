import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

import s from './styles.css';

import { title, html } from './index.md';
import store from '../../core/store';

import showDetailsIcon from '../../resources/showdetails.png';
import hideDetailsIcon from '../../resources/hidedetails.png';
import showButtonsIcon from '../../resources/showbuttons.png';

import OverviewTable from './overviewGrid';

class OverviewPage extends React.Component {
  constructor(){
    super();
    this.state = {
      mode: store.getState().mode,
      recognitionCategory: store.getState().recognitionCategory,
      view: 'gridView'
    }
  }

  componentDidMount() {
    document.title = title;
  }

  switchView() {
    this.refs.overView.switchView();
  }

  getFooterRightContent() {
    return (<Button onClick={() => this.switchView()} > switch view </Button>);
  }

  render() {
    //<div className= {s.recognitionCategoryText}> {this.state.recognitionCategory} - Mode {this.state.mode}</div>
    return (
      <Layout className={s.content} footerRightContent={this.getFooterRightContent()}>
        <div className= {s.recognitionCategoryText}>
          <div className={s.categoryTextWrapper}>Mode {this.state.mode} - {this.state.recognitionCategory}</div>
        </div>
        <div className={s.tableWrapper}>
          <OverviewTable ref="overView"/>
        </div>
      </Layout>
    );
  }
}

export default OverviewPage;
