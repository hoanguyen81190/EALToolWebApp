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
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    const { footerLeftContent, footerRightContent, ...newProps } = this.props; //exclude footer properties from props because we cannot pass them to the div tag in main content
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header" ref={node => (this.root = node)}>
        <div className="mdl-layout__inner-container ">
          <Header className={s.headerlayout}/>
          <main className="mdl-layout__content">
            <div {...newProps} className={cx(s.content, this.props.className)} />
          </main>
          <Footer className={s.footerlayout} leftContent={this.props.footerLeftContent} rightContent={this.props.footerRightContent}/>
        </div>
      </div>
    );
  }
}

export default Layout;
