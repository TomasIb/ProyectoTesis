import React from "react";
import {  Grid, Paper, Typography } from '@material-ui/core';
import Chart from './Chart';
import { chartColors } from 'styles/chartColors';
import TableMetrics from './TableMetrics';

function TrainReport(props) {
    const { data,trainTime, isMultiClass,chartData,dataToDownload,datasetSize,title,classes, fixedHeightPaper,handleOpenImageDialog,openModalGridSearch } =  props;
    return (
        <React.Fragment>
            <Typography component="h3" variant="h5" className={classes.titleMetrics} gutterBottom>{title} <small> with {datasetSize}% of dataset </small></Typography>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={4} md={3} lg={3}>
                    <Paper elevation={8} className={fixedHeightPaper} >
                        <img alt="..." src={`data:image/png;base64,${data[0].CMBINARY}`} style={{ height: '100%', width: '100%', cursor: 'pointer', position: 'static' }} onClick={e => handleOpenImageDialog(data[0].CMBINARY)} />
                    </Paper>
                </Grid>
                {isMultiClass === false ?
                    <Grid item xs={12} sm={8} md={9} lg={9}>
                        <Paper elevation={8} className={fixedHeightPaper} style={{ overflow: "hidden" }}>
                            <Chart data={chartData} colors={chartColors} />
                        </Paper>
                    </Grid>
                    : null}

                <Grid item xs={12} md={12} lg={12}>
                    <Paper elevation={8} className={classes.paper}>
                        <TableMetrics dataToDownload={dataToDownload} data={data} trainTime={trainTime} seeConfusionMatrix={handleOpenImageDialog} seeGridSearch={openModalGridSearch} isMultiClass={isMultiClass} type={title} />
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default TrainReport;