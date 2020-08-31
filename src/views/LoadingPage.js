import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { CircularProgress, Typography } from '@material-ui/core';
import { message } from "../services/socket";
import { loadingImages } from "../constants/images";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100vh',
    },
    image: {
        borderRadius: 50,
        width: 500,
    },
    centerLoading: {
        justifyContent: "center",
        alignContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginLeft: theme.spacing(8),
    },
}));

function LoadingPage(props) {
    const type = props.type || props.location.state.type;
    const [title, setTitle] = React.useState(undefined)

    React.useEffect(() => {
        message(data => {
            setTitle(data.message)            
        });
    }, [title])

    const classes = useStyles();
    return (
        <React.Fragment>
            <Grid container className={classes.root}>
                <Grid item className={classes.centerLoading}>
                    <img src={loadingImages[type].uri} className={classes.image} style={{ marginRight: '60px', height: 'auto' }} alt={type} />                    
                    <div >
                        <Typography color="initial" variant="h6" component="h6" style={{ fontWeight: 550 }} ><CircularProgress size={19} color="primary" /> <span>&nbsp;&nbsp;</span>{title !== undefined ? title : loadingImages[type].text}</Typography>
                        <Typography color="inherit" variant="subtitle2" component="h6" style={{ fontWeight: 500 }}>   This should take a while, please wait  <br /></Typography>

                    </div>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default LoadingPage;