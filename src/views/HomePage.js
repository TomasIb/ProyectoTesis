import React, { useEffect } from 'react';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Forms from '../components/forms/Forms';
import Hidden from '@material-ui/core/Hidden';
import styles from '../components/home/styles';
import { Copyright } from '../components/home/copyright';
import LoadingPage from './LoadingPage';
import AlertErase from '../components/AlertErase';
import ImageSlider from '../components/home/ImageSlider';
import Tooltip from '@material-ui/core/Tooltip';
import { apiService } from 'services/apiService';

export default function SignInSide(props) {
  const classes = styles();
  const loadRef = React.useRef()
  const [fileUploaded, setFileUploaded] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [openConfirmResetModal, setOpenConfirmResetModal] = React.useState(false);
  useEffect(() => {
    localStorage.removeItem('metrics')
    localStorage.removeItem('client')
  }, [])
  const loadModel = (e) => loadRef.current.click();

  const onChangeFile = (e) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const json = JSON.parse(e.target.result)
      localStorage.setItem('client', json.client)
      props.history.replace({
        pathname: "/metrics",
        state: { makingMetrics: false, loadedMetrics: json.metrics }
      });
    };
    reader.readAsText(e.target.files[0])
  }

  const handleLoading = (loading) => {
    setIsLoading(loading)
    !loading && setIsReady(true)
  }

  const handleIsReady = (ready) => setIsReady(ready);
  const handleOpenConfirmResetModal = () => {
    setOpenConfirmResetModal(true);          
  }

  const deleteFolder = () => {
    const res = apiService.get('reset');
    console.log(res)
  }

  return (
    <React.Fragment>
      <Grid container className={classes.root}>
        <CssBaseline />
        <AlertErase title={'Are you sure to reset the pipeline?'} setOpen={setOpenConfirmResetModal} open={openConfirmResetModal} deleteFolder={deleteFolder} />
        {isLoading ?
          <LoadingPage type={'massSpectrometry'} />
          :
          <React.Fragment>
            <Grid item xs={false} sm={6} md={7} elevation={6}>
              <Grid item xs={false} sm={6} md={7} className={classes.brandPlace}>
                <Typography component="h5" variant="h5" className={classes.brand} >
                  Pipe
          </Typography>
              </Grid>
              <Hidden xsDown >
                <ImageSlider />
              </Hidden>
            </Grid>
            <Grid item xs={12} sm={6} md={5} elevation={6}>
              <div className={classes.paper}>
                <form className={classes.form} noValidate>
                  <Typography component="h1" variant="h4" className={classes.title} >
                    Make an analysis
                  </Typography>
                  {fileUploaded === '' ?
                    <Typography component="h3" variant="subtitle1" className={classes.subtitle} >
                      To start drag and drop your csv or xlsx file into dropzone, or simply click on it.
                    </Typography>
                    : null}
                  <div className={classes.dropzone}>

                    {!isLoading && <Forms
                      fileUploaded={fileUploaded}
                      setFileUploaded={setFileUploaded}
                      handleLoading={handleLoading}
                      isReady={isReady}
                      handleIsReady={handleIsReady}
                      handleOpenConfirmResetModal={handleOpenConfirmResetModal}
                    />}

                  </div>
                  {fileUploaded === '' ?
                    <React.Fragment>
                      <Typography component="h3" variant="h6" className={classes.title} >
                        OR
                    </Typography>
                      <Tooltip title="Load the results.json in Documents/Analysis folder" placement="top">
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          onClick={e => loadModel(e)}
                        >
                          Load Analysis
                      </Button>
                      </Tooltip>
                      <input type="file" id="file" accept="application/json" ref={loadRef} style={{ display: "none" }} onChange={(e) => onChangeFile(e)} />
                    </React.Fragment>
                    : null}
                  <Grid item xs>
                    <Link variant="subtitle2">
                      for details see the Wiki
              </Link>
                  </Grid>
                  <Box mt={5}>
                    <Copyright />
                  </Box>
                </form>
              </div>
            </Grid>
          </React.Fragment>
        }

      </Grid>
    </React.Fragment>

  );
}