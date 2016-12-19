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
import Navigation from './Navigation';
import Link from '../Link';
import s from './Header.css';

import store from '../../core/store';

class Header extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    return (
      <header className={`mdl-layout__header ${s.header}`} ref={node => (this.root = node)}>
        <div className={`mdl-layout__header-row ${s.row}`}>
          <div className={s.wrap}>
            <div className={s.progress}>
              STEP 1
              <br/>
              Choose Mode
            </div>
            <div className={s.progress}>
              STEP 2
              <br/>
              Choose Recognition Category
            </div>
            <div className={s.progress}>
              STEP 3
              <br/>
              Choose Condition
            </div>
            <div className={s.progress}>
              STEP 4
              <br/>
              Classification
            </div>
          </div>
          <div className="mdl-layout-spacer"></div>
          <Navigation />
        </div>
      </header>
    );
  }

}

export default Header;
