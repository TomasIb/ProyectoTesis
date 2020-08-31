import React, { useState } from 'react';
import { withRouter } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DropzoneOrMassSpectrometry from './DropzoneOrMassSpectrometry';
import { apiService } from 'services/apiService';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Questions from './questions/Questions';
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';
import MassSteppers from './questions/MassSteppers';
import { withSnackbar } from 'notistack';

const initialStateMassSpectrometry = {
  "ionTechnique": {
    "name": "MALDI-TOF",
  },
  "dataReduce": {
    "name": "Alignment",
  },
  "values": {
    "binSize": 10,
    "sigmaLow": 5,
    "sigmaMid": 10,
    "sigmaHigh": 15
  }
};

function Forms(props) {
  const { fileUploaded, setFileUploaded } = props;
  const classes = useStyles();
  const [isMsDataset, setIsMsDataset] = useState(false);  
  const [massSpectrometryParams, setMassSpectrometryParams] = React.useState(initialStateMassSpectrometry);

  const handleReset = () => {
    props.handleLoading(false)
    setFileUploaded('')
    setIsMsDataset(false)
    setMassSpectrometryParams(initialStateMassSpectrometry)
    props.handleIsReady(false)
    props.history.push({ pathname: "/" })

  }

  const handleUploadFile = (file) => setFileUploaded(file)
  const handleDeleteFile = () => setFileUploaded('');

  const handleSwitchChange = (event) => {
    setIsMsDataset(event.target.checked)

  }


  const handleMassSpectrometry = (step, key, value) => {
    let ms = massSpectrometryParams;    
    ms[step][key] = value;
    if (value === "Binning") {
      ms.binSize = 10;
      ms.sigmaLow = ms.sigmaMid = ms.sigmaHigh = null;
    }
    else if (value === "Alignment") {
      ms.sigmaLow = 3;
      ms.sigmaMid = 4;
      ms.sigmaHigh = 5;
    }

    setMassSpectrometryParams(ms);
  }

  const handleCloseDialogMassSpectrometry = () => {    
    setMassSpectrometryParams(initialStateMassSpectrometry)
    setIsMsDataset(!isMsDataset)
  }

  const handlePost = async (e) => {    
    const formData = new FormData();
    formData.append('file', fileUploaded[0])
    formData.append('isMassData', isMsDataset)
    isMsDataset && formData.append('massSpectrometryParams', JSON.stringify(massSpectrometryParams))
    
    isMsDataset && props.handleLoading(true)
    const res = await apiService.post('upload', formData)


    if (res.status === 200) {
      props.handleLoading(false)
      var { mainPath } = res.data;
      localStorage.setItem('client', mainPath)
      setFileUploaded(true)
      props.enqueueSnackbar('Successfully uploaded ', { variant: 'success' })

    }
    else {
      props.enqueueSnackbar('The format of the dataset is not compatible, please check it!', { variant: 'error' })
      handleReset()
    }
  }


  return (
    <React.Fragment>
      <MassSteppers submit={handlePost} handleMassSpectrometry={handleMassSpectrometry} params={massSpectrometryParams} close={handleCloseDialogMassSpectrometry} open={isMsDataset} />
      <div className={classes.form} style={fileUploaded !== '' ? { marginTop: '100px' } : null} noValidate>

        {props.isReady === true ?
          <Questions width={props.width} height={props.height} handleReset={handleReset} {...props} />
          :
          <React.Fragment>
            <Grid className={classes.grid} >

              <Grid item xs={12} md={12} lg={12}>
                <DropzoneOrMassSpectrometry
                  handleUploadFile={handleUploadFile}
                  fileUploaded={fileUploaded}
                  handleDeleteFile={handleDeleteFile}
                  isMsDataset={isMsDataset}
                  handleSwitchChange={handleSwitchChange}
                />
              </Grid>
              {fileUploaded !== '' ?
                <Zoom in={true} style={{ '500ms': '0ms' }}>
                  <Button variant="contained" color="primary" size="large" className={classes.submit} onClick={handlePost}>
                    Start Pipe
                  </Button>
                </Zoom>
                : null}
            </Grid>
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  )
}

export default withRouter(withSnackbar(Forms));

const useStyles = makeStyles((theme) => ({
  form: {
    // width: '100%',
  },
  submit: {
    borderRadius: '25px',
    fontWeight: '600',
    display: 'flex',
    justifyContent: "center"
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  }
}));
