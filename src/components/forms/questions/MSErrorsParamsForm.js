import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default function MSErrorsParamas(props) {
  let { handleMassSpectrometry , params} = props;   
  

  const handleChange = (e,key) => {
    // const re = /^[0-9.,]+$/   //FLOAT
    // const lastdigit =  e.target.value.toString().split('').pop() //FLOAT        
    const re = /^[0-9]+$/   //INT    
    // if (re.test(e.target.value) ||lastdigit === '.' ||lastdigit===',' || e.target.value === '' ) {      //FLOAT
    if (re.test(e.target.value) || e.target.value === '' ) {      
      var value = isNaN(e.target.value) === ''?'':e.target.value
      handleMassSpectrometry('values',key,value);   
      props.forceUpdate();   
    }             
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
      {params.dataReduce.name === "Binning" ?
        <Grid item xs={12} md={6}>
            <TextField
              value={params.values.binSize}
              onChange={(e)=> handleChange(e,'binSize')}
              required
              name="Bins"
              placeholder="default size: 10"
              label="Bin Size"
              helperText="Error value of mass spectrometry values"
              fullWidth
              autoComplete="cc-csc"
            />
          </Grid>
        :
        params.ionTechnique.name === "ESI" ?
          <Grid item xs={12} md={6}>
            <TextField
              value={params['values']['sigmaLow']}
              onChange={(e)=>handleChange(e,'sigmaLow')}
              required
              name="Sigma"
              placeholder="Hint: 4"
              label="Sigma"
              helperText="Error value of mass spectrometry values"
              fullWidth
              autoComplete="cc-csc"
            />
          </Grid>
          :
          <React.Fragment>
            <Grid item xs={12} md={6}>
              <TextField
                value={params.values.sigmaLow}
                onChange={(e)=>handleChange(e,'sigmaLow')}
                required
                name="SigmaLow"
                placeholder="Hint: 4"
                label="Sigma Low"
                helperText="Low error value of mass spectrometry values"
                fullWidth
                // autoComplete="cc-csc"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={params.values.sigmaMid}
                onChange={(e)=>handleChange(e,'sigmaMid')}
                required
                name="SigmaMid"
                placeholder="Hint: 5"
                label="Sigma Mid"
                helperText="Mid error value of mass spectrometry values"
                fullWidth
                autoComplete="cc-csc"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={params.values.sigmaHigh}
                onChange={(e)=>handleChange(e,'sigmaHigh')}
                required
                name="SigmaHigh"
                placeholder="Hint: 6"
                label="Sigma High"
                helperText="High error value of mass spectrometry values"
                fullWidth
                autoComplete="cc-csc"
              />
            </Grid>
          </React.Fragment>

        }

      </Grid>
    </React.Fragment>
  );
}