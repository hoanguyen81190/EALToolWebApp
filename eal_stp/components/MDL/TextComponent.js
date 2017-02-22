import React, { PropTypes } from 'react';

export class TextComponent extends React.Component{
  constructor() {
    super();
    this.state = {
      text : "Current EAL - No Emergency"
    }
  }
  // static defaultProps = {
  //       text: "",
  //
  //   };

  render(){
    var ele = <div className={this.props.style}>{this.state.text}</div>;
    return ele;
  }
}
