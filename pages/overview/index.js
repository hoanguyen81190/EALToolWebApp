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
import {eALDocument} from '../../database-loader';

class ConditionOperator extends React.Component {
  render() {
    <div>
      {this.props.text}
    </div>
  }
}

class Condition extends React.Component {
  render() {
    if(this.props.type === "Leaf") {
      console.log(this.props.type);
      var ele =
      <div>
         {this.props.description}
      </div>;
       return ele;

    }
    // else {
    //   var element =
    //    <div>
    //      {
    //        this.props.children.map((ele, index) => {
    //          <div key={index}>
    //            <Condition type={ele.type} description={ele.description} children={ele.children}/>
    //            <div>
    //              {ele.type}
    //            </div>
    //          </div>
    //        })
    //      }
    //
    //   </div>;
      var testEle = <div>{this.props.type}</div>
      return testEle;
    // }
  }
}

class Criterion extends React.Component {
  constructor() {
    super();
  }
  render() {

    var element =
      <div>
        {this.props.description.text}
      </div>
    ;
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
        <h1>{store.getState().category}</h1>
        <div id="relative">
        {
            eALDocument.getRecognitionCategoryData(store.getState().category).emergency_categories.map(
              (ele, index) => {
                var element = <div className={s.wrapper} key={index}>
                  <div className={s.box}>
                    {ele.name}
                  </div>
                                {
                                  ele.criterions.map(
                                    (criterion, i) => {
                                      return <div className={s.box} key={i}>
                                        {
                                          criterion.name
                                        }
                                        <Condition type = {criterion.conditions.type}
                                          description = {criterion.conditions.description}
                                          children = {criterion.conditions.children}/>
                                      </div>
                                    }
                                  )
                                }
                              </div>
                return element;
              }
            )
          }
        </div>
      </Layout>
    );
  }

}

export default OverviewPage;
