import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import SubTitle from './SubTitle';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles((theme) => ({

    elements: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        display: "flex"
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        marginBottom:theme.spacing(1),
        color: theme.palette.grey[500],
    },

}));

const MainDialog = (props) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Dialog onClose={props.handleClose} aria-labelledby="simple-dialog-title" open={props.open} >

                <DialogTitle id="scroll-dialog-title">
                    <Grid container spacing={1} direction="row">
                        <Grid item md={10}>
                            <Title> {props.title} </Title>
                        </Grid>
                        <Grid item md={2}>
                            <IconButton aria-label="close" className={classes.closeButton} onClick={props.handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                        <Grid item md={12}>
                            <SubTitle> {props.subtitle} </SubTitle>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent dividers={'paper'}>
                    <Box my={2}>
                        {props.children}
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
export default MainDialog;