/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

import s from './styles.css';

import { title, html } from './index.md';
import store from '../../core/store';
import history from '../../core/history';

import {eALDocument} from '../../database-loader';
import OverviewTable from './flexGridTest';

class Condition extends React.Component {
  render() {
    if(this.props.object.type === "Leaf") {
      var element =
      <div>
         {(this.props.index + 1) + '. '}
         <div dangerouslySetInnerHTML={{__html: this.props.object.description.text}}/>
      </div>;
      return element;
    }
    else {
      var element =
       <div>
         {
           this.props.object.children.map((ele, index) => {
             if(index != this.props.object.children.length - 1) {
               return <div key={index}>
                 <Condition object = {ele} index = {index}/>
                 {this.props.object.type}
               </div>;
             }
             return <div key={index}>
               <Condition object = {ele} index = {index}/>
             </div>;
           })
         }
      </div>;
      return element;
    }
  }
}

class Criterion extends React.Component {
  constructor() {
    super();
  }

  handleClick(criterion) {
    var action = {
      type : 'SETMODE',
      mode : store.getState().mode,
      category : store.getState().category,
      level : this.props.level,
      object: criterion
    }
    store.dispatch(action);
    history.push("/classifying");
  }

  render() {
    console.log(this.props.criterion.conditions);
    if(typeof(this.props.criterion.conditions) == "undefined" ||
        (Object.keys(this.props.criterion.conditions).length === 0 && this.props.criterion.conditions.constructor === Object)) {
      var condition = <div/>;
    }
    else {
      var condition = <Condition
          object = {this.props.criterion.conditions} index = {0}/>;
    }
    var element =
    <div className={s.box} onClick={() => this.handleClick(this.props.criterion)}>
      {this.props.criterion.name}
      <div>{this.props.criterion.description.text}</div>
      {condition}
    </div>;
    return element;
  }
}

class OverviewPage extends React.Component {
  constructor(){
    super();
    this.state = {
      mode: store.getState().mode,
      category: store.getState().category
    }
  }

  // static propTypes = {
  //   articles: PropTypes.array.isRequired,
  // };

  componentDidMount() {
    document.title = title;
  }


  render() {
    return (
      <Layout className={s.content}>
        <div className={s.tableWrapper}>
          <OverviewTable />
        </div>
        {
        /*
        <div className={s.recognitionCategory}>
          <h1>{store.getState().category} - Mode: {store.getState().mode}</h1>
        </div>

        <div className={s.overviewTable}>

            eALDocument.getRecognitionCategoryData(store.getState().category).emergency_categories.map(
              (ele, index) => {
                var element = <div key={index}>
                  <div className={s.columnWrapper}>
                    <div className={s.emergencyCategory}>
                      {ele.name}
                    </div>
                    <div className={s.categories}>
                      {
                        ele.criterions.map(
                          (criterion, i) => {
                            return <div className={s.criterion}><Criterion criterion = {criterion} key={i} level = {ele.name}/></div>;
                          }
                        )
                      }
                    </div>
                  </div>
                </div>
                return element;
              }
            )
          }
        </div> */
      }
      </Layout>
    );
  }

}

export default OverviewPage;
