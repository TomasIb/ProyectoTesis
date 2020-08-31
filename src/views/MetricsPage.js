import React, { useEffect } from 'react';
import useStyles from '../components/metrics/styles'
import clsx from 'clsx';
import { Container, Grid, Hidden, Box } from '@material-ui/core';
import ShowImage from '../components/metrics/ShowImage';
import DialogTable from '../components/metrics/DialogTable';
import ColumnsList from '../components/metrics/ColumnsList';
import FloatingActionsButton from '../components/metrics/FloatingActionsButton';
import AlertErase from '../components/AlertErase';
import LoadingPage from './LoadingPage';
import { withSnackbar } from 'notistack';
import { withRouter } from "react-router-dom";
import { getMetrics } from 'services/metrics/getMetrics';
import Header from 'components/metrics/Header';
import Resume from 'components/metrics/Resume';
import Report from 'components/metrics/Report';


function Metrics(props) {
  const classes = useStyles();
  const [metrics, setMetrics] = React.useState(null);
  const [encodedImage, setEncodedImage] = React.useState(null); //imagen a ver en modal
  const [dialogTableData, setDialogTableData] = React.useState(null);
  const [columnsSelectedData, setColumnsSelectedData] = React.useState(null);
  const [openImageDialog, setImageDialog] = React.useState(false) //Matriz de Confusion Modal
  const [openGSmodal, setGSmodal] = React.useState(false) //GridSearch Modal
  const [openCSModal, setCSmodal] = React.useState(false) //Columnas Seleccionadas Modal
  const [openConfirmEraseModal, setConfirmEraseModal] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    async function handleApiRequest() {
      try {
        let loadedMetrics = props.location.state !== undefined ? props.location.state.loadedMetrics : JSON.parse(localStorage.getItem('metrics'));        
        const res = await getMetrics(loadedMetrics)
        setMetrics(res)
        setIsReady(true)
        props.enqueueSnackbar('Succefully getting metrics!', { variant: 'success' })
      } catch (err) {
        props.history.replace("/");
      }
    }
    if (localStorage.getItem('client') !== "") {
      handleApiRequest()
    }

  }, [props]);

  const openModalColumnsSelected = (data, type) => {
    var dataWithType = {columns: data , type:type}    
    setColumnsSelectedData(dataWithType)
    setCSmodal(true)
  }

  const handleCloseModalColumnsSelected = () => {
    setCSmodal(false)
    setColumnsSelectedData(null)
  }

  const handleOpenImageDialog = (binaryImage) => {
    setEncodedImage(binaryImage)
    setImageDialog(true)
  }

  const handleCloseImageDialog = () => {
    setImageDialog(false);
  };

  const openOverSample = (data, title) => {    
    data = { title: title + ' Results', subtitle: 'SMOTE', headers: data.headers, values: data.values, index: data.index }
    setDialogTableData(data)
    setGSmodal(true)
  }
  const openModalGridSearch = (data, subtitle) => {
    var _headers = []
    var _values = []
    Object.keys(data[0]).reduce((result, currentKey) => {
      _headers.push(currentKey)
      _values.push(data[0][currentKey])

      return _headers
    }, []);


    data = { title: 'Grid Search Results', subtitle: subtitle, headers: _headers, values: _values, index: [] }
    setDialogTableData(data)
    setGSmodal(true)

  }

  const handleCloseModalGridSearch = () => {
    setGSmodal(false);
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <React.Fragment>
      {metrics && isReady && <Header classes={classes} />}
      {metrics && isReady ?
        <main className={classes.content}>
          <Container maxWidth="xl" className={classes.container}>

            <ShowImage encodedData={encodedImage} open={openImageDialog} handleClose={handleCloseImageDialog} />
            {columnsSelectedData !== null ? <ColumnsList open={openCSModal} handleClose={handleCloseModalColumnsSelected} data={columnsSelectedData} /> : null}
            <AlertErase title={'Do you want to do a new analysis? The results of this analysis are in Documents folder!'} setOpen={setConfirmEraseModal} open={openConfirmEraseModal} />
            {dialogTableData !== null ? <DialogTable open={openGSmodal} handleClose={handleCloseModalGridSearch} data={dialogTableData} /> : null}
            <FloatingActionsButton setConfirmEraseModal={setConfirmEraseModal} />

            {/* Resume */}
            <Grid container spacing={1}>
              <Resume
                fixedHeightPaper={fixedHeightPaper}
                openOverSample={openOverSample}
                seeColumnsSelectedModal={openModalColumnsSelected}
                imageModal={handleOpenImageDialog}
                metrics={metrics}
              />

              {/* TRAIN */}
             <Report
                data={metrics.metricsTrain}
                trainTime={metrics.trainTime}
                isMultiClass={metrics.isMultiClass}
                chartData={metrics.rocPointsTrain}
                dataToDownload={metrics.metricsToDownload}
                datasetSize={100 - metrics.testSize}
                title={'Train'}
                classes={classes}
                fixedHeightPaper={fixedHeightPaper}
                handleOpenImageDialog={handleOpenImageDialog}
                openModalGridSearch={openModalGridSearch}
              />

              {/* Test   */}
              {metrics.isMultiClass === false ?
                <Report
                  data={metrics.metricsTest}
                  trainTime={metrics.trainTime}
                  isMultiClass={metrics.isMultiClass}
                  chartData={metrics.rocPointsTest}
                  dataToDownload={metrics.metricsToDownload}
                  datasetSize={metrics.testSize}
                  title={'Validation Test'}
                  classes={classes}
                  fixedHeightPaper={fixedHeightPaper}
                  handleOpenImageDialog={handleOpenImageDialog}
                  openModalGridSearch={openModalGridSearch}
                />
                : null}
            </Grid>
            <Box >
              <Hidden smDown>
                <div style={{ alignContent: 'flex-start', display: 'flex', justifyContent: 'flex-start' }} >
                  <img src={require('../assets/gummy-macbook.png')} className={classes.imageResults} style={{ maxWidth: '7%', maxHeight: '7%', position: 'relative' }} alt="me" />
                  <p className={classes.author} >Created by Tom Ibanez <br /> <small>Tesis 2020 - Universidad Católica del Maule</small></p>
                </div>
              </Hidden>
            </Box>


          </Container>

        </main>
        :
        <LoadingPage type={'metrics'} />
      }
    </React.Fragment>

  );
}

export default withRouter(withSnackbar(Metrics));
