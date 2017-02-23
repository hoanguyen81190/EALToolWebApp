import React from 'react';

import cs from './ConditionComponents.css';

import store from '../../core/store';

import greenCheck from '../../resources/green_check.png';
import redCheck from '../../resources/red_check.png';
import greyCheck from '../../resources/grey_icon.png';

let uniqueID = 0;
function generateID(){
  uniqueID++;
  return uniqueID;
}

export class Condition extends React.Component {

  constructor() {
    super();
    this.type = "Leaf";
    this.children = [];
  }

  componentWillMount(){
    this.id = generateID();
    if(this.props.content.value === undefined) {
      this.props.content.value = {};
      this.props.content.value[this.props.mode] = false;
    }
    else {
      if(!(this.props.mode in this.props.content.value)) {
        this.props.content.value[this.props.mode] = false;
      }
    }
  }

  getValue() {
    if (this.type === 'Leaf') {
      return this.props.content.value[this.props.mode];
    }

    var children = [];
    this.children.map((item) => {children.push(this.refs[item].getValue())});

    switch (this.type) {
      case 'OR':
        this.props.content.value[this.props.mode] = children.reduce((a, b) => a || b);
        return this.props.content.value[this.props.mode];
      case 'AND':
        this.props.content.value[this.props.mode] = children.reduce((a, b) => a && b);
        return this.props.content.value[this.props.mode];
      case 'XOR':
        this.props.content.value[this.props.mode] = children.reduce((a, b) => a ^ b);
        return this.props.content.value[this.props.mode];
      default:
        return false;
    }
  }

  handleConditionClicked(){
    this.props.content.value[this.props.mode] = !this.props.content.value[this.props.mode];
    if(this.props.callback !== undefined) {
      this.props.callback();
    }
  }

  renderLeafNode(){
    var checkImage;
    if(this.props.content.mode_applicability !== undefined) {
      if(this.props.content.mode_applicability.indexOf(store.getState().mode) === -1) {
        var treeCardContent =
          <div className={cs.leafContainer + " " + cs.disableConditionLeaf} >
            <div className={cs.conditionTextWrapper}>
              <span dangerouslySetInnerHTML={{__html: this.props.content.description.text}}/>
            </div>
          </div>;
        return treeCardContent;
      }
    }

    if(this.props.content.value[this.props.mode]){
      checkImage = redCheck;
    }
    else{
      checkImage = greyCheck;
    }

    var treeCardContent =
      <div className={cs.leafContainer} onClick={this.handleConditionClicked.bind(this)}>
        <div className={cs.conditionTextWrapper}>
          <span dangerouslySetInnerHTML={{__html: this.props.content.description.text}}/>
        </div>
        <img className={cs.checkImage} src={checkImage} alt="Check icon"/>
      </div>;

    return treeCardContent;
  }

  renderLogicNode(){
    var logicConditionColor;
    if(this.props.content.value[this.props.mode]){
     logicConditionColor = this.props.conditionColor.trueColor;
    }
    else{
      logicConditionColor = this.props.conditionColor.falseColor;
    }

    // logicConditionColor = "mdl-color--indigo-50";
    var style = '';
    if(this.props.firstCondition) {
      style = this.props.conditionStyle;
    }
    this.children = [];
    var element = <div className={cs.tableWrapper}><table className={cs.conditionTable}>
      <tbody className={cs.tableSize}>
        {this.props.content.children.map((child, index) => {
          var childRef = "child" + index;
          this.children.push(childRef);
          var borderBottomStyle = "";
          if (index !== this.props.content.children.length - 1)
          {
            borderBottomStyle = cs.cellBorderBottom;
          }

          var conditionContent = <Condition ref={childRef} content={child} callback={this.props.callback} conditionColor={this.props.conditionColor} mode={this.props.mode}/>;

          if(!this.props.firstChild){
            conditionContent = <td className={cs.conditionCell + " " + borderBottomStyle}>{conditionContent}</td>
          }

          if(index === 0){
            var row = <tr>
              <td rowSpan={this.props.content.children.length}
                className={cs.logicConditionText + " " + cs.conditionCell + " " + logicConditionColor + " " + cs.logicCell + " " + style}>
                {this.props.content.type}
              </td>

              {conditionContent}
            </tr>
          }
          else {
            var row = <tr>{conditionContent}</tr>;
          }
          return row;
        })}
      </tbody>
    </table></div>;

    return element;
  }

  render() {
    var ele;
    this.type = this.props.content.type;
    if(this.type === undefined) {
      ele = <div className={cs.notApplicableCell}>Not Applicable</div>;
    }
    else if(this.type === "Leaf") {
      ele = this.renderLeafNode();
    }
    else {
      ele = this.renderLogicNode();
    }
    return ele;
  }
}
