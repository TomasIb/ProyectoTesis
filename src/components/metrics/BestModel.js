import React, { useEffect, useState } from 'react';
// import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import Circle from 'react-circle';
// import { apiService } from 'services/apiService';
// import { LinkButton } from './Buttons';
// var fileDownload = require('js-file-download');

const useStyles = makeStyles((theme) => ({
  performanceCircle: {
    display:'inline-grid',
    flex: 1,
    alignItems:'center',    
    justifyContent:'center',
    textAlign:'center'
    
  }
  
}));

export default function BestModel(props) {
  const classes = useStyles();
  const  bestModel  = props.metrics.bestModel;  
  const [progressBar, setProgressBar] = useState(0);
  const speed = 70
  const pace = bestModel.accuracy / speed;

  useEffect(() => {
    if (bestModel.accuracy > 0) {
      setTimeout(() => {
        setProgressBar(p => p + 0.5);
      }, pace);
    }
  }, [bestModel.accuracy, pace]);

  useEffect(() => {
    if (progressBar < bestModel.accuracy) {
      setTimeout(() => {
        setProgressBar(p => p + 0.5);
      }, pace);
    }
  }, [bestModel.accuracy, progressBar, pace]);

  // const downloadBestModel = async () => {
  //   const res = await apiService.get('downloadmodel')    
  //   fileDownload(res.data, 'best_model.sav');
  // }


  return (
    <React.Fragment>
      <Title>Best Performance</Title>
      {bestModel ? (
        <React.Fragment>
        <div className={classes.performanceCircle}>
    
            <Circle
              size={120}
              animate={true}
              animationDuration={100}
              progress={parseInt(progressBar)}
              lineWidth={30}
            />
          <Title ><small>{bestModel.name}</small></Title>
          </div>
        </React.Fragment>
      ) : (null)}
      
        {/* <Link download={"bestModel.sav"} onClick={(e) => downloadBestModel()}>
          <LinkButton size="small">Download Model </LinkButton>
        </Link> */}
      
    </React.Fragment>
  );
}