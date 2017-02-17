import React from 'react';
import Link from '../Link';
import s from './Footer.css';

class Footer extends React.Component {
  render() {
    var footer;
    if(this.props.leftContent || this.props.rightContent){
      footer = <footer className={s.footer + " mdl-mini-footer"}>
        <div className={s.footer + " mdl-mini-footer__left-section"}>
          <div className={s.footerLeftContent}>{this.props.leftContent}</div>
        </div>
        <div className={s.footer + " mdl-mini-footer__right-section"}>
          <div className={s.footerRightContent}>{this.props.rightContent}</div>
        </div>
      </footer>;
    }
    else {
      footer = <div></div>;
    }

    return (
      footer
    );
  }
}

export default Footer;
