import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  textTitle: {
    color: 'black',
    opacity: .8
  }
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PopUpMissValues(props) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.close}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
      >
        <Paper className={classes.paper}>
          <MuiDialogTitle disableTypography className={classes.root} >
            <Typography component="h2" variant="h5" className={classes.textTitle} gutterBottom>
              {props.title}
            </Typography>
          </MuiDialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" className={classes.textTitle}>
              {props.subtitle}
            </DialogContentText>
            <FormControl component="fieldset" >
              <FormGroup>
                {props.selectedOption !== undefined ?
                  <RadioGroup onChange={props.handleRadioPopUp} value={props.selectedOption}  >
                    {props.options.map((option) =>
                      <ListItem button key={option}>
                        <FormControlLabel value={option} control={<Radio />} label={option} />
                      </ListItem>
                    )}
                  </RadioGroup>
                  :
                  null
                }
              </FormGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.close} color="primary">
              Accept
          </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </div>
  );
}
export default PopUpMissValues;