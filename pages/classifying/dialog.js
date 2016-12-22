import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from 'react-mdl';

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
      <Dialog open={this.state.openDialog}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <p>{this.state.content}</p>
        </DialogContent>
        <DialogActions>
          <Button type='button' onClick={this.handleCloseDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>;

    return (dialog);
  }
}
export default DialogDemo;
