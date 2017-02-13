import React from 'react';
import Navigation from './Navigation';
import Link from '../Link';
import s from './Header.css';

import store from '../../core/store';
import history from '../../core/history';

import ifeLogo from '../../resources/logo-en.png';

class NavigationBar extends React.Component {
  constructor() {
    super();
  }

  handleClick(page) {
    history.push(page);
  }

  render() {
    var home = <div className={s.progress} onClick={() => this.handleClick('/')}>
                 <div className={s.navigationText}>STEP 1 <br/>
                   Choose Mode & Recognition Category</div>
                </div>;
    var overview = <div className={s.progress} onClick={() => this.handleClick('/overview')}>
                <div className={s.navigationText}>STEP 2 <br/>
                  Choose Event</div>
               </div>;
    var classifying = <div className={s.progress} onClick={() => this.handleClick('/classifying')}>
                <div className={s.navigationText}>STEP 3 <br/>
                  Classification</div>
               </div>;
    var barriermatrix = <div className={s.progress} onClick={() => this.handleClick('/barriermatrix')}>
              <div className={s.navigationText}>STEP 2 <br/>
                Barrier Matrix Classification</div>
              </div>;



    var headerContent = null;
    /*var ifeLogoRight = <div className={s.ifeLogoContainer}>
      <a href="https://www.ife.no/en" target="_blank">
        <img className={s.ifeLogo} src={ifeLogo} alt="IFE logo"/>
      </a>
    </div>;*/

    //Without IFE link
    var ifeLogoRight = <div className={s.ifeLogoContainer}>
        <img className={s.ifeLogo} src={ifeLogo} alt="IFE logo"/>
    </div>;

    switch (history.getCurrentLocation().pathname){
        case '/':
          headerContent=  <div className={s.wrap}>
                              {home}
                              {ifeLogoRight}
                          </div>
          break;
        case '/overview':
          headerContent= <div className={s.wrap}>
                           {home}
                           {overview}
                           {ifeLogoRight}
                         </div>;
          break;
        case '/classifying':
          headerContent=<div className={s.wrap}>
                          {home}
                          {overview}
                          {classifying}
                          {ifeLogoRight}
                        </div>;
          break;
        case '/barriermatrix':
          headerContent=<div className={s.wrap}>
                          {home}
                          {barriermatrix}
                          {ifeLogoRight}
                        </div>;
          break;
    }
    return headerContent;
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
        <div className={`mdl-layout__header-row ${s.navigatonBarWrapper}`}>
          <NavigationBar />
          <div className="mdl-layout-spacer"></div>
          <Navigation />
        </div>
      </header>
    );
  }

}

export default Header;
