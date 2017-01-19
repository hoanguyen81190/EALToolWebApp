import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from 'react-mdl';
import s from './styles.css';
const React = require('react');

class DialogDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  handleOpenDialog(event) {
    this.setState({
      openDialog: true
    });
  }

  handleCloseDialog() {
    this.setState({
      openDialog: false
    });

    //Fixes issue where scrolling stops working after dialog is closed
    document.getElementsByClassName('mdl-layout__inner-container')[0].style.overflowX='auto';
    document.getElementsByClassName('mdl-layout__inner-container')[0].style.overflowX='';
    document.getElementsByClassName('mdl-layout__inner-container')[0].style.overflowY='';
    document.getElementsByClassName('mdl-layout__inner-container')[0].style.overflowY='auto';
  }

  render() {
    var dialog = <div>
      <Dialog className={s.dialogDiv} open={this.state.openDialog}>
        <DialogTitle>{this.state.title}</DialogTitle>
        <DialogContent>
          {this.state.content}
        </DialogContent>
        <DialogActions>
          <Button className={s.dialogButton} type='raised' onClick={this.handleCloseDialog}>{this.state.buttonText}</Button>
        </DialogActions>
      </Dialog>
    </div>;

    return (dialog);
  }
}
export default DialogDemo;
