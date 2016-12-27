import store from '../../core/store';
import s from './styles.css';

import history from '../../core/history';

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
  render() {
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
             if(index != this.props.object.children.length - 1) {
               return
                      <div className={s.test} key={index}>
                        <Condition object = {ele} index = {index}/>
                        <div className={s.operator}>{this.props.object.type}</div>
                      </div>;
             }
             return <div className={s.test2} key={index}>
                    <Condition object = {ele} index = {index}/>
                    </div>;
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

    this.state = {
      conditionNumbers : []
    }
  }

  createRowData(categories, content)
  {
    return{
      emergencyLevel : emergencyCat,
      content: content,
    }
  }

  getCondition(condition){
    if(Object.keys(condition).length === 0 && condition.constructor === Object)
    {
      var result = <div>None</div>;
    }
    else {
      var result = <Condition object={condition}/>
    }
    return result;
  }

  getRow(product, productIndex) {
    var row =
          <tr className={s.barrierTableRow}>
            <td className="mdl-cell--3-col-tablet">{(productIndex+1) + '. ' + product.name}</td>
            <td>{this.getCondition(product.loss)}</td>
            <td>{this.getCondition(product.potential_loss)}</td>
          </tr>;
    return row;
  }

  render() {
    var table =
      <table className={s.barrierTable + " mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp"}>
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
