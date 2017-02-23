import React, { PropTypes } from 'react';
import cx from 'classnames';
import Header from './Header';
import Footer from '../Footer';
import s from './Layout.css';

class Layout extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    footerLeftContent: PropTypes.object,
    footerRightContent: PropTypes.object
  };

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
    this.setupTouchListeners();
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
    this.removeTouchListeners();
  }

  getFooterRef() {
    return this.refs.FooterRef;
  }

  render() {
    const { footerLeftContent, footerRightContent, ...newProps } = this.props; //exclude footer properties from props because we cannot pass them to the div tag in main content
    return (
      <div id="TouchLayout" className="mdl-layout mdl-js-layout mdl-layout--fixed-header" ref={node => (this.root = node)}>
        <div className="mdl-layout__inner-container ">
          <Header className={s.headerlayout}/>
          <main className="mdl-layout__content">
            <div {...newProps} className={cx(s.content, this.props.className)} />
          </main>
          <Footer ref="FooterRef" className={s.footerlayout} leftContent={this.props.footerLeftContent} rightContent={this.props.footerRightContent}/>
        </div>
      </div>
    );
  }

  removeTouchListeners(){
    var touchElement = document.getElementById("TouchLayout");
    touchElement.removeEventListener('touchstart', this.startTouch, true);
    touchElement.removeEventListener('touchmove', this.touchMove, true);
    touchElement.removeEventListener('touchend', this.endTouch, true);
  }

  /* Touch configuration */
  setupTouchListeners(){
    var touchElement = document.getElementById("TouchLayout");
    touchElement.addEventListener('touchstart', this.startTouch, true);
    touchElement.addEventListener('touchmove', this.touchMove, true);
    touchElement.addEventListener('touchend', this.endTouch, true);
    this.startTouchElement = null;
    this.startTouchElementSet = false;
    this.startTouchTime = null;
    this.startTouchLocation = null;
    this.endTouchLocation = null;
  }

  startTouch(ev){
    this.startTouchElement = ev.touches.item(0).target;
    this.startTouchTime = new Date();
    this.startTouchLocation = ev.touches.item(0).pageY;
    this.endTouchLocation = this.startTouchLocation;

    //Multi Touch
    if (ev.touches.length > 1)
    {
        /**
         * On a single touch input device, there can only be one point
         * of contact on the surface, so the following code can only
         * execute when the terminal supports multiple touches.
         */
         console.log('Hello Multiple Touch!');
         for(var i = 0; i < ev.touches.length; i++){
           console.log(ev.touches[i].target.class)
         }
    }
  }

  touchMove(ev){
    this.endTouchLocation = ev.touches.item(0).pageY;
  }

  endTouch(ev){
    if(ev.target.id === "fullscreenButton"){
      return;
    }

    if(this.startTouchElement === ev.target){
      if(ev.target.id !== "fullscreenButton"){
        if(new Date() - this.startTouchTime < 200) //if the touch duration was less than 200ms it could be a tap
        {
          var locationDifference = Math.abs(this.endTouchLocation - this.startTouchLocation); //Check the location difference of the start and end touch
          if(locationDifference <= 10){ //If the difference is lower than or equal to this threshold it is considered as a tap
            ev.preventDefault();
            ev.target.click();
          }
        }
      }
    }
    //this.startTouchElementSet = false;

    //Check if the element has a class.
    //console.log(ev.target.classList.contains("Touchable"));
  }
}

export default Layout;
