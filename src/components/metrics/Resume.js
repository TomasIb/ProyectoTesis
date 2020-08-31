import React from "react";
import { Grid, Paper } from '@material-ui/core';
import BestModel from './BestModel';
import ResumeTable from './ResumeTable';

function Resume(props) {
    const { fixedHeightPaper } = props;
    return (
        <>
        <Grid item xs={12} md={9} lg={9}>
            <Paper elevation={8} className={fixedHeightPaper}>
                <ResumeTable {...props} />
            </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
            <Paper elevation={8} className={fixedHeightPaper}>
                <BestModel {...props} />
            </Paper>
        </Grid>
        </>
    );
}

export default Resume;