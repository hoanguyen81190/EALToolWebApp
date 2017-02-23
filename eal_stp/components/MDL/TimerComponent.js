import React from 'react';

import timers from './TimerComponent.css';
import store from '../../core/store';

let uniqueID = 0;
function generateID(){
  uniqueID++;
  return uniqueID;
}

export class TimerComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      type: "decrement",
      finished: false
    }
  }

  componentDidMount() {
    // this.setState({
    //   hours: this.props.hours,
    //   minutes: this.props.minutes,
    //   seconds: this.props.seconds,
    //   type: this.props.type
    // });

    this.state = {
      hours: this.props.hours,
      minutes: this.props.minutes,
      seconds: this.props.seconds,
      type: this.props.type,
      finished: false
    }

    var intervalId = setInterval(this.timer.bind(this), 60000); //update every 60 seconds
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount(){
    var action = {
      type : 'SET_TIME',
      hours: this.state.hours,
      minutes: this.state.minutes,
      seconds: this.state.seconds
    };
    store.dispatch(action);
    clearInterval(this.state.intervalId);
  }

  timer() {
     if (this.state.type === "decrement") {
      this.setState({ seconds: this.state.seconds - 1});
      if(this.state.seconds < 0) {
        this.setState({ seconds: 59});
        this.setState({ minutes: this.state.minutes - 1});
      }
      if(this.state.minutes < 0) {
        this.setState({ minutes: 59});
        this.setState({ hours: this.state.hours - 1});
      }
      if(this.state.hours < 0) {
        this.setState({ hours: 0});
        this.setState({finished: true});
      }
     }
     else if (this.state.type === "increment") {
      // this.setState({ seconds: this.state.seconds + 1});
      // if(this.state.seconds >= 60) {
      //   this.setState({ seconds: 0});
      //   this.setState({ minutes: this.state.minutes + 1});
      // }
      // if(this.state.minutes >= 60) {
      //   this.setState({ minutes: 0});
      //   this.setState({ hours: this.state.hours + 1});
      // }
      this.setState({minutes: this.state.minutes + 1});
     }
    if(this.state.finished) {
      clearInterval(this.state.intervalId);
    }

  }

  stopTimer() {
    this.state.finished = true;
  }

  resetTimer() {
    this.setState({
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: false
    });
    var action = {
      type : 'SET_TIME',
      hours: this.state.hours,
      minutes: this.state.minutes,
      seconds: this.state.seconds
    };
    store.dispatch(action);
  }

  getTime() {
    if(this.state.hours < 10)
      var hoursText = '0' + this.state.hours;
    else
      var hoursText = this.state.hours;
    if(this.state.minutes < 10)
      var minutesText = '0' + this.state.minutes;
    else {
      var minutesText = this.state.minutes;
    }
    if(this.state.seconds < 10)
      var secondsText = '0' + this.state.seconds;
    else {
      var secondsText = this.state.seconds;
    }
    return {hoursText} + ':' + {minutesText} + ':' + {secondsText};
  }

  render () {
    // if(this.state.hours < 10)
    //   var hoursText = '0' + this.state.hours;
    // else
    //   var hoursText = this.state.hours;
    // if(this.state.minutes < 10)
    //   var minutesText = '0' + this.state.minutes;
    // else {
    //   var minutesText = this.state.minutes;
    // }
    // if(this.state.seconds < 10)
    //   var secondsText = '0' + this.state.seconds;
    // else {
    //   var secondsText = this.state.seconds;
    // }
    // var ele = <span className={timers.clockStyle}>
    //   {hoursText}:{minutesText}:{secondsText}
    // </span>;
    var ele = <span className={timers.clockStyle}>
      {this.state.minutes}
    </span>
    return ele;
  }
}