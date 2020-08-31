import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import MSIonTecniqueForm from './MSIonTecniqueForm';
import MSErrorsParamsForm from './MSErrorsParamsForm';
import MSDataReduce from './MSDataReduce';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  textTitle: {
    color: 'black',
    opacity: .8
  }
}));

const steps = ['Mass Spectrometry', 'Data Reduction', 'Set Params of Reduction'];

export default function MassSteppers(props) {
  const classes = useStyles();  
  const [activeStep, setActiveStep] = React.useState(0);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepContent = (step) =>{
    switch (step) {
      case 0:
        return <MSIonTecniqueForm {...props} forceUpdate={forceUpdate} />;      
      case 1:
        return <MSDataReduce {...props} forceUpdate={forceUpdate}/>;
      case 2:
        return <MSErrorsParamsForm {...props} forceUpdate={forceUpdate}/>
      default:
        throw new Error('Unknown step');
    }
  
  }

  return (
    
    <Dialog onClose={props.close} className={classes.paper} PaperComponent={Paper}  open={props.open} maxWidth="md" fullWidth>
      <Paper className={classes.paper}>
        <MuiDialogTitle disableTypography className={classes.root} >
          <Typography component="h2" variant="h5" className={classes.textTitle} gutterBottom>
            Selecting mass ionization technique
        </Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={props.close}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
  
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={activeStep === steps.length - 1 ? props.submit : handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Place MS params' : 'Next'}
                  </Button>
                </div>
              </React.Fragment>            
        </React.Fragment>
      </Paper>
    </Dialog>

  );
}