import React from 'react';
import Link from '../Link';
import s from './Footer.css';
import {TimerComponent} from '../MDL/TimerComponent';
import store from '../../core/store';

class Footer extends React.Component {
  componentWillMount() {
    this.setState({EAL: store.getState().highestClassification});
  }

  updateEAL() {
    console.log("EAL" + store.getState().highestClassification);
    this.setState({EAL: store.getState().highestClassification});
  }

  getFooterCenterContent() {
    return (
      <span>
        <span className={s.clockTextStyle}>EAL - {this.state.EAL} (last evaluated: </span>
        <TimerComponent
          ref="clockRef"
          hours={store.getState().hours} minutes={store.getState().minutes} seconds={store.getState().seconds} type="increment"/>
        <span className={s.clockTextStyle}>m)</span>
      </span>
    );
  }

  getClockRef() {
    return this.refs.clockRef;
  }

  render() {
    var footer;
    if(this.props.leftContent || this.props.rightContent){
      footer = <footer className={s.footer + " mdl-mini-footer"}>
        <div className={s.footer + " mdl-mini-footer__left-section"}>
          <div className={s.footerLeftContent}>{this.props.leftContent}</div>
        </div>
        <div className={s.footer + " mdl-mini-footer__right-section"}>
          <div className={s.footerCenterContent}>{this.getFooterCenterContent()}</div>
        </div>
        <div className={s.footer + " mdl-mini-footer__right-section"}>
          <div className={s.footerRightContent}>{this.props.rightContent}</div>
        </div>
      </footer>;
    }
    else {
      footer = <footer className={s.footer + " mdl-mini-footer"}>
        <div className={s.footer + " mdl-mini-footer__right-section"}>
          <div className={s.footerCenterContent}>{this.getFooterCenterContent()}</div>
        </div>
      </footer>;
    }

    return (
      footer
    );
  }
}

export default Footer;
