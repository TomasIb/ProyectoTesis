import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from 'components/metrics/Title';
import SubTitle from 'components/metrics/SubTitle';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import RadioForm from './RadioForm';

const useStyles = makeStyles((theme) => ({
    elements: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        textAlign:"center",
        display: "flex"
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }, 
    submit: {
        borderRadius: '25px',
        margin: 'auto',
        color: 'white',
        fontWeight: '600',
    },
    resetButton: {
        color: 'red',

    }
    
}));

const ModalParams = (props) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Dialog  className={classes.root} aria-labelledby="simple-dialog-title" open={props.open} fullWidth>
                <MuiDialogTitle disableTypography  >
                    <Title> { props.params.title } </Title>
                    <SubTitle> { props.params.name } </SubTitle>
                    
                </MuiDialogTitle>
                <div className={classes.elements}>
                    {props.children}
                    <RadioForm zoom={true} loading={false} stepName={  props.params.name } title={""} options={props.params.choices} handleChangeRadio={props.handleChangeRadioParameter} selected={props.selectedAlgorithmParameter} />
                </div>

                <Grid container direction="row" justify="center" style={{marginBottom:'inherit'}}>
                    <Grid item>
                        <Button variant="contained" color="primary" className={classes.submit} onClick={e => props.handleClose()} >                           
                            {'Aceptar'}
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>
        </React.Fragment>
    );
}
export default ModalParams;