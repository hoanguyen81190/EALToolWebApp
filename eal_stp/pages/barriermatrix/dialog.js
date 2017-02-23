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
  }

  render() {
    var dialog = <div>
      <Dialog open={this.state.openDialog} className={s.dialogDiv}>
        <DialogTitle><div className={s.dialogTitleText}>{this.state.title}</div></DialogTitle>
        <DialogContent>
          <div className={s.dialogText}>{this.state.content}</div>
        </DialogContent>
        <DialogActions>
          <Button className={s.dialogButton} type='button' onClick={this.handleCloseDialog}>{this.state.buttonText}</Button>
        </DialogActions>
      </Dialog>
    </div>;

    return (dialog);
  }
}
export default DialogDemo;
