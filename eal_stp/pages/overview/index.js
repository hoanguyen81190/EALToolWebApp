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

class SwitchViewButton extends React.Component {
  componentWillMount() {
    this.setState({view: store.getState().overviewPageStyle});
  }

  handleClick() {
    this.props.onClickCallBack();
    this.setState({view: (this.state.view + 1)%3});
  }

  render() {
    // var image;
    // switch ((this.state.view + 1)%3) {
    //   case 0: image = showDetailsIcon;
    //     break;
    //   case 1: image = hideDetailsIcon;
    //     break;
    //   case 2: image = showButtonsIcon;
    //     break;
    //   default:
    // }
    // <img className={s.buttonIcon} src={image} alt="Switch View"/>
    var text;
    switch ((this.state.view + 1)%3) {
      case 0: text = "Details";
        break;
      case 1: text = "Simplify";
        break;
      case 2: text = "Collapse";
        break;
      default:
    }
    var ele = <Button className={s.switchViewButton} onClick={() => this.handleClick()} type='raised'>
              <span className={s.switchViewButtonText}>{text}</span>
            </Button>;
    return ele;
  }
}

class OverviewPage extends React.Component {
  constructor(){
    super();
    this.state = {
      mode: store.getState().mode,
      recognitionCategory: store.getState().recognitionCategory,
    }
  }

  componentDidMount() {
    document.title = title;
  }

  switchView() {
    this.refs.overView.switchView();
  }

  getFooterRightContent() {
    return (<SwitchViewButton onClickCallBack={()=>this.switchView()}/>);
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
