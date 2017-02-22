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
    touchElement.removeEventListener('touchstart', this.startTouch, false);
    touchElement.removeEventListener('touchend', this.endTouch, false);
  }

  /* Touch configuration */
  setupTouchListeners(){
    var touchedElement = document.getElementById("TouchLayout");
    touchedElement.addEventListener('touchstart', this.startTouch, false);
    touchedElement.addEventListener('touchend', this.endTouch, false);
    this.startTouchElement = null;
    this.startTouchElementSet = false;
    this.startTouchTime = null;
  }

  startTouch(ev){
    /*if(ev.touches.item(0).target.id === "fullscreenButton"){
      return;
    }*/

    if(!this.startTouchElementSet){
      this.startTouchElement = ev.touches.item(0).target;
      this.startTouchTime = new Date();
      this.startTouchElementSet = true;
    }


    //ev.preventDefault();

    //console.log(ev.touches.item(0).target);

    if (ev.touches.item(0).target === ev.targetTouches.item(0).target)
    {
        /**
         * If the first touch on the surface is also targeting the
         * "touchable" element, the code below should execute.
         * Since targetTouches is a subset of touches which covers the
         * entire surface, TouchEvent.touches >= TouchEvents.targetTouches
         * is always true.
         */
         //ev.target.click();
    }
    else if (ev.touches.length === ev.targetTouches.length)
    {
        /**
         * If all of the active touch points are on the "touchable"
         * element, the length properties should be the same.
         */

         console.log('All points are on target element');
    }
    else if (ev.touches.length > 1)
    {
        /**
         * On a single touch input device, there can only be one point
         * of contact on the surface, so the following code can only
         * execute when the terminal supports multiple touches.
         */
         for(var i = 0; i < ev.touches.length; i++){
           console.log(ev.touches[i].target.class)
         }
         console.log('Hello Multiple Touch!');
    }
  }

  endTouch(ev){
    console.log(ev);

    if(ev.target.id === "fullscreenButton"){
      return;
    }

    console.log(ev.target);
    if(this.startTouchElement === ev.target){
      if(ev.target.id !== "fullscreenButton"){
        if(new Date() - this.startTouchTime < 200) //if less than 200ms it was a tap
        {
          ev.preventDefault();
          ev.target.click();
        }
      }
    }
    this.startTouchElementSet = false;

    //Check if the element has a class.
    //console.log(ev.target.classList.contains("Touchable"));
  }
}

export default Layout;
