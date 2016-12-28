import store from '../../core/store';
import s from './styles.css';

import history from '../../core/history';

import documentIcon from '../../resources/Document-50.png';

const React = require('react');

class Condition extends React.Component {
  constructor() {
    super();
    this.type = null;
    this.value = false;
    this.children = [];
  }
  handleChangeChk(event) {
    this.value = event.target.checked;
  }

  getValue() {
    if (this.type === 'Leaf') {
      return this.value;
    }
    var children = [];

    this.children.map((item) => {children.push(this.refs[item].getValue())});
    switch (this.type) {
      case 'OR':
        return children.reduce((a, b) => a || b);
      case 'AND':
        return children.reduce((a, b) => a && b);
      case 'XOR':
        return children.reduce((a, b) => a ^ b);
      default:
        return false;
    }
  }

  render() {
    this.type = this.props.object.type;
    if(this.props.object.type === "Leaf") {
      var element =
      <div className={s.conditionLeaf}>
         <input className={s.checkbox} type="checkbox" defaultChecked={false} onChange={this.handleChangeChk.bind(this)} />
         <span dangerouslySetInnerHTML={{__html: this.props.object.description.text}}/>
      </div>;
      return element;
    }
    else {
      var element =
       <div>
         {
           this.props.object.children.map((ele, index) => {
             var child = "child" + index;
             this.children.push(child);
             if(index != this.props.object.children.length - 1) {
               return <div key={index}>
                        <Condition object = {ele} index = {index} ref={child}/>
                        <div className={s.operator}>{this.props.object.type}</div>
                      </div>;
             }
             return <Condition object = {ele} index = {index} ref={child}/>;
           })
         }
      </div>;
      return element;
    }
  }
}

class BarrierTable extends React.Component {
  constructor(props) {
    super(props);
    this.children = [];
  }

  getValue() {
    var numberOfLoss = 0;
    var numberOfPotentialLoss = 0;
    this.props.barrier.products.map((p, index) => {
      var lossRef = 'loss' + index;
      var potentialLossRef = 'potential_loss' + index;
      if(this.refs[lossRef] && this.refs[lossRef].getValue()) numberOfLoss++;
      if(this.refs[potentialLossRef] && this.refs[potentialLossRef].getValue()) numberOfPotentialLoss++;
    });
    var result = {
      loss: numberOfLoss,
      potential_loss: numberOfPotentialLoss
    }
    return result;
  }

  getCondition(condition, type, index){
    if(Object.keys(condition).length === 0 && condition.constructor === Object)
    {
      var result = <div>None</div>;
    }
    else {
      var ref = type + '' + index;
      var result = <div><Condition object={condition} ref={ref}/></div>;
    }
    return result;
  }

  getRow(product, productIndex) {
    var row =
          <tr className={s.barrierTableRow}>
            <td className={s.barrierTableCell} onClick={() => this.props.documentCallback(product.description.ref.page, product.description.ref.range)}>
              {(productIndex+1) + '. ' + product.name + ' '}
              <img className={s.documentIcon} src={documentIcon} alt="."/>
            </td>
            <td className={s.barrierTableCell}>{this.getCondition(product.loss, 'loss', productIndex)}</td>
            <td className={s.barrierTableCell}>{this.getCondition(product.potential_loss, 'potential_loss', productIndex)}</td>
          </tr>;
    return row;
  }

  render() {
    var table =
      <table className={s.barrierTable}>
        <thead>
          <tr className={s.barrierTableHeader}>
            <th>{this.props.barrier.name}</th>
            <th>Loss</th>
            <th>Potential Loss</th>
          </tr>
        </thead>
        <tbody>
          {this.props.barrier.products.map((product, productIndex) => {
            return this.getRow(product, productIndex);
          })}
        </tbody>
      </table>

    return(table);
  }
}

export default BarrierTable;
