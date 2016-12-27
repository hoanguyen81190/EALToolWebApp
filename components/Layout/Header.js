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
import history from '../../core/history';

class NavigationBar extends React.Component {
  constructor() {
    super();
  }

  handleClick(page) {
    history.push(page);
  }

  render() {
    var home = (<div className={s.progress} onClick={() => this.handleClick('/')}>
                  STEP 1
                  <br/>
                  Choose Mode & Recognition Category
                </div>);
    var overview = <div className={s.progress} onClick={() => this.handleClick('/overview')}>
                      STEP 2
                      <br/>
                      Choose Event
                    </div>;
    var classifying = <div className={s.progress} onClick={() => this.handleClick('/classifying')}>
                        STEP 3
                        <br/>
                        Classification
                      </div>;
    var barriermatrix = <div className={s.progress} onClick={() => this.handleClick('/barriermatrix')}>
                        STEP 2
                        <br/>
                        Barrier Matrix Classification
                      </div>;
    switch (history.getCurrentLocation().pathname) {
      case '/':
        return (<div className={s.wrap}>
                        {home}
                      </div>);
        break;
      case '/overview':
        return (<div className={s.wrap}>
                        {home}
                        {overview}
                      </div>);
        break;
      case '/classifying':
        return (<div className={s.wrap}>
                        {home}
                        {overview}
                        {classifying}
                      </div>);
        break;
      case '/barriermatrix':
        return (<div className={s.wrap}>
                        {home}
                        {barriermatrix}
                      </div>);
        break;
      default:

    }
  }
}

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
          <NavigationBar />
          <div className="mdl-layout-spacer"></div>
          <Navigation />
        </div>
      </header>
    );
  }

}

export default Header;
