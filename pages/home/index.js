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
import {eALDocument} from '../../database-loader';

import store from '../../core/store';
import history from '../../core/history';

class HomePage extends React.Component {
  constructor(){
    super();
    this.state = {
      mode: null,
      recognitionCategory: null
    }
  }

  componentDidMount() {
    document.title = title;
  }

  handleModes(_mode){
    var element = document.getElementById(this.state.mode);
    if (element != null)
    {
      element.style = 'raised';
    }


    document.getElementById(_mode).style.backgroundColor = 'Red';
    this.setState({mode: _mode});
  }

  handleCategories(_cat){
    var element = document.getElementById(this.state.recognitionCategory);
    if (element != null)
      element.style = 'raised';
    document.getElementById(_cat).style.backgroundColor = 'Red';
    this.setState({recognitionCategory: _cat});
  }

  handleSubmit() {
    //TODO: check if the selection is valid
    if(this.state.mode == null || this.state.recognitionCategory == null)
    {
        alert("Please select the mode and the recognition category before pressing submit!");
    }
    else {

      var action = {
        type : 'SET_STATE',
        mode : this.state.mode,
        recognitionCategory : this.state.recognitionCategory,
        emergencyLevel: null,
        criterionObject: null
      }
      store.dispatch(action);
      if(this.state.recognitionCategory === 'barriermatrix')
      {
        history.push('/barriermatrix');
      }
      else
      {
        history.push("/overview");
      }
    }
  }

  getFooterContent(){
    return(
      <Button className={s.home_button} type='raised'
        onClick={()=>this.handleSubmit()}>
        Submit
      </Button>
    );
  }

  render() {
    return (
      <Layout className={s.content} footerLeftContent={this.getFooterContent()}>
        <h4>Choose Modes</h4>
          {eALDocument.data.modes.map((mode, i) =>
            {
              return <Button className={s.home_button} id={mode} type='raised' key={i} onClick={() => this.handleModes(mode)} >{mode}</Button>}
          )}
        <h4>Choose Categories</h4>
          <Button className={s.home_button} id='barriermatrix' type='raised' key={0} onClick={() => this.handleCategories('barriermatrix')} >FISSION PRODUCT BARRIER MATRIX</Button>
          {eALDocument.data.recognition_categories.map((cat, i) =>
            {
              return <Button className={s.home_button} id={cat.name} type='raised' key={i+1} onClick={() => this.handleCategories(cat.name)} >{cat.name}</Button>}
        )}
      </Layout>
    );
  }

}

export default HomePage;
