/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Link from '../Link';
import s from './Footer.css';

class Footer extends React.Component {
  render() {
    var footer;
    if(this.props.leftContent || this.props.rightContent){
      footer = <footer className={s.footer + " mdl-mini-footer"}>
        <div className={s.footer + " mdl-mini-footer__left-section"}>
          {this.props.leftContent}
        </div>
        <div className="mdl-mini-footer__right-section">
          {this.props.rightContent}
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
