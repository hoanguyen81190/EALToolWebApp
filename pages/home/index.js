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
      recognitionCategory: null,
      disableBarrierButton: false,
      disableIncompatibleModeButtons: false
    }
  }

  componentDidMount() {
    document.title = title;
  }

  handleModes(_mode){
    var element = document.getElementById(this.state.mode);
    this.changeButtonOnClick(element);
    this.handleModeButtonDisabling(_mode);
    document.getElementById(_mode).style.backgroundColor = 'Red';
    this.setState({mode: _mode});
  }

  handleCategories(_cat){
    var element = document.getElementById(this.state.recognitionCategory);
    this.changeButtonOnClick(element);
    this.handleCategoriesButtonDisabling(_cat);
    document.getElementById(_cat).style.backgroundColor = 'Red';
    this.setState({recognitionCategory: _cat});
  }

  handleModeButtonDisabling(mode){

    console.log(eALDocument.data);

    


    if(mode === 5 || mode === 6 || mode === 'Defueled')
    {
      var barrierButton = document.getElementById('barriermatrix');
      this.changeButtonOnClick(barrierButton);
      barrierButton.disabled = true;
      if(this.state.recognitionCategory === 'barriermatrix')
      {
        this.state.recognitionCategory = null;
      }
    }
    else
    {
      var barrierButton = document.getElementById('barriermatrix');
      barrierButton.disabled = false;
    }
  }

  handleCategoriesButtonDisabling(category){
    if(category === 'barriermatrix')
    {
      var mode5Button = document.getElementById('5');
      mode5Button.disabled = true;
      var mode6Button = document.getElementById('6');
      mode6Button.disabled = true;
      var modeDefueledButton = document.getElementById('Defueled');
      modeDefueledButton.disabled = true;

      if(this.state.mode === 5 || this.state.mode === 6 || this.state.mode === 'Defueled')
      {
        this.state.mode = null;
      }
    }
    else {
      var mode5Button = document.getElementById('5');
      mode5Button.disabled = false;
      var mode6Button = document.getElementById('6');
      mode6Button.disabled = false;
      var modeDefueledButton = document.getElementById('Defueled');
      modeDefueledButton.disabled = false;
    }
  }

  /**
  * Updates the look of the previously clicked button
  * @param button - React button
  */
  changeButtonOnClick(button){
      if (button != null){
        button.style.backgroundColor = '';
      }
  }

  handleSubmit() {
    //check if the selection is valid
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
      <Button className={s.submit_button} type='raised'
        onClick={()=>this.handleSubmit()}>
        Submit
      </Button>
    );
  }

  renderWithFooter(){
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

  renderNoFooter(){
    return (
      <Layout className={s.content}>
        <div className={s.modeContainer}>
          <h4>Select Mode</h4>
            {eALDocument.data.modes.map((mode, i) =>
              {
                return <Button className={s.home_button} id={mode} type='raised' key={i} onClick={() => this.handleModes(mode)} >{mode}</Button>}
            )}
        </div>

        <hr className={s.seperatingBorder} />

        <div className={s.categoriesContainer}>
          <h4>Select Category</h4>

          <Button className={s.home_button} id='barriermatrix' type='raised' key={0} onClick={() => this.handleCategories('barriermatrix')} >FISSION PRODUCT BARRIER MATRIX</Button>


            {eALDocument.data.recognition_categories.map((cat, i) =>
              {
                return <Button className={s.home_button} id={cat.name} type='raised' key={i+1} onClick={() => this.handleCategories(cat.name)} >{cat.name}</Button>}
            )}
        </div>
      </Layout>
    );
  }

  render() {
    return this.renderNoFooter();
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.mode !== null && this.state.recognitionCategory !== null)
    {
      this.handleSubmit();
    }
  }
}

export default HomePage;
