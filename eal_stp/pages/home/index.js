import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import {ResetButton} from '../../components/MDL/CustomMDLComponents';

import s from './styles.css';
import { title, html } from './index.md';
import {eALDocument} from '../../database-loader';

import store from '../../core/store';
import history from '../../core/history';

import resetIcon from '../../resources/reset_icon.png';

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
    document.getElementById(_mode).style.backgroundColor = "#EF5350";
    this.setState({mode: _mode});
  }

  handleCategories(_cat){
    var element = document.getElementById(this.state.recognitionCategory);
    this.changeButtonOnClick(element);
    this.handleCategoriesButtonDisabling(_cat);
    document.getElementById(_cat.name).style.backgroundColor = "#EF5350";
    this.setState({recognitionCategory: _cat.name});
  }

  handleModeButtonDisabling(mode){
    var recognitionCategories = eALDocument.data.recognition_categories;

    for(var i = 0; i < recognitionCategories.length; i++){
        document.getElementById(recognitionCategories[i].name).disabled = (recognitionCategories[i].mode_applicability.indexOf(mode) === -1);
    }

    if(mode === 5 || mode === 6 || mode === 'Defueled')
    {
      var barrierButton = document.getElementById('barriermatrix');
      this.changeButtonOnClick(barrierButton);
      barrierButton.disabled = true;
    }
    else
    {
      var barrierButton = document.getElementById('barriermatrix');
      barrierButton.disabled = false;
    }
  }

  handleCategoriesButtonDisabling(category){
    if(category.mode_applicability !== undefined){
      for(var i = 0; i < eALDocument.data.modes.length; i++){
        document.getElementById(eALDocument.data.modes[i]).disabled = (category.mode_applicability.indexOf(eALDocument.data.modes[i]) === -1);
      }
    }

    if(category.name === 'barriermatrix')
    {
      var mode5Button = document.getElementById('5');
      mode5Button.disabled = true;
      var mode6Button = document.getElementById('6');
      mode6Button.disabled = true;
      var modeDefueledButton = document.getElementById('Defueled');
      modeDefueledButton.disabled = true;
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

  onClickReset() {
    eALDocument.resetValues();
    var actionSetHighestClassification = {
      type: 'RESET_HIGHEST_CLASSIFICATION'
    }
    store.dispatch(actionSetHighestClassification);
    this.refs.LayoutRef.getFooterRef().getClockRef().resetTimer();
    this.refs.LayoutRef.getFooterRef().updateEAL();
  }

  getFooterRightContent() {
    return(
      <ResetButton onClickCallBack={()=>this.onClickReset()} buttonText="Reset"/>
    );
  }

  // renderWithFooter(){
  //   return (
  //     <Layout  className={s.content} footerLeftContent={this.getFooterContent()} >
  //       <h4>Choose Modes</h4>
  //         {eALDocument.data.modes.map((mode, i) =>
  //           {
  //             return <Button className={s.home_button} id={mode} type='raised' key={i} onClick={() => this.handleModes(mode)} >{mode}</Button>}
  //         )}
  //       <h4>Choose Categories</h4>
  //
  //       <Button className={s.home_button} id='barriermatrix' type='raised' key={0} onClick={() => this.handleCategories('barriermatrix')} >FISSION PRODUCT BARRIER MATRIX</Button>
  //
  //
  //         {eALDocument.data.recognition_categories.map((cat, i) =>
  //           {
  //             return <Button className={s.home_button} id={cat.name} type='raised' key={i+1} onClick={() => this.handleCategories(cat.name)} >{cat.name}</Button>}
  //       )}
  //     </Layout>
  //   );
  // }

  renderRightFooter(){
    var barrierMatrix = {
      name: "barriermatrix"
    };

    return (
      <Layout ref="LayoutRef" className={s.content} footerRightContent={this.getFooterRightContent()}>
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

          <Button className={s.home_button} id='barriermatrix' type='raised' key={0} onClick={() => this.handleCategories(barrierMatrix)} >FISSION PRODUCT BARRIER MATRIX</Button>


            {eALDocument.data.recognition_categories.map((cat, i) =>
              {
                return <Button className={s.home_button} id={cat.name} type='raised' key={i+1} onClick={() => this.handleCategories(cat)} >{cat.name}</Button>}
            )}
        </div>


        <div className={s.fullscreenButtonWrapper} onClick={() => this.toggleFullscreen()}>
          <Button className={s.fullscreenButton} id='fullscreenButton' type='raised' key={0}>Fullscreen</Button>
        </div>

      </Layout>
    );
  }

  render() {
    return this.renderRightFooter();
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.mode !== null && this.state.recognitionCategory !== null)
    {
      this.handleSubmit();
    }
  }

  toggleFullscreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
     (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
}

export default HomePage;
