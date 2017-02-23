import React, { PropTypes } from 'react';
import {Snackbar} from 'react-mdl';

import s from './HistoryComponent.css';

import {eALDocument} from '../../database-loader';

let uniqueID = 0;
function generateID(){
  uniqueID++;
  return uniqueID;
}

export class HistoryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    this.handleClickActionSnackbar = this.handleClickActionSnackbar.bind(this);
    this.state = { isSnackbarActive: false };
  }

  componentWillMount(){
    this.id = generateID();
  }

  showSnackbar() {
    this.setState({ isSnackbarActive: true });
  }

  handleTimeoutSnackbar() {
    this.setState({ isSnackbarActive: false });
  }

  handleClickActionSnackbar() {
   this.setState({ isSnackbarActive: false });
 }

  getHistoryRow(evt) {
    return (<div>{evt.timestamp}: {evt.event.eal}</div>);
  }

  getHistoryTable() {
    return (<div>{eALDocument.history.eventList.map((event, index) => {
      return this.getHistoryRow(event);
    })}</div>);
  }

  render() {
    var ele = <Snackbar

          active={this.state.isSnackbarActive}
          onClick={this.handleClickActionSnackbar}
          onTimeout={this.handleTimeoutSnackbar}
          action="Close"
          timeout={60000}>{this.getHistoryTable()}</Snackbar>
    ;
    return ele;
  }
}
