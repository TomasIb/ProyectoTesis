import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect,useLocation } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

const error = createMuiTheme({ palette: { primary: red } })


export default function AlertErase(props) {
    let location = useLocation();    
    const { title } = props;
    const [confirm,setConfirm] = React.useState(false)    

    const handleAccept = () => {
        props.setOpen(false);          
        props.deleteFolder && props.deleteFolder()
        localStorage.removeItem('metrics')
        localStorage.removeItem('client') 

        location.pathname==='/metrics' && setConfirm(true)
        location.pathname==='/'&& window.location.reload()

  

    };

    const handleCancel = () => {
        props.setOpen(false);
        setConfirm(false)
    };

    return (
        <div>
            {confirm ?
                <Redirect to="/" />
                : null}
            <Dialog
                open={props.open}
                onClose={handleCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle disableTypography={true} id="alert-dialog-title">{"Confirm"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    {title}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="secondary" autoFocus>
                        Cancel
                    </Button>
                    <MuiThemeProvider theme={error}>
                        <Button size="medium" color="primary" onClick={handleAccept}>Accept </Button>
                    </MuiThemeProvider>


                </DialogActions>
            </Dialog>
        </div>
    );
}