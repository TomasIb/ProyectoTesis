import React from "react";
import {Grid,Grow,Typography} from '@material-ui/core';

function Header(props) {
    const {classes} = props;
    return (

        <Grow in={true}>
            <Grid container direction="row" justify="space-between">
                <Grid item xs={false} sm={8} md={8}  >                    
                    <Typography component="h6" variant="h4" className={classes.brand}>Pipe</Typography>
                    <Typography component="h3" variant="h5" className={classes.rootTitle} gutterBottom>Results, metrics and charts</Typography>
                </Grid>
            </Grid>
        </Grow>
    );

}
export default Header;