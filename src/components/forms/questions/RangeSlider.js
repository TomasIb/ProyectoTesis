import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import QuestionTitle from './QuestionTitle';


export const PrettoSlider = withStyles({
    root: {
      color: '#1d8cf8',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);


const useStyles = makeStyles((theme) => ({
  root: {
    width: 400,
  },
  space: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: 400,
    height: theme.spacing(6),
    justifyContent: "center",
    justifyItems: "center",
    alignContent: "center",
    display: "flex"
  }
}));

const marks = [{value: 90},{value: 80},{value: 70}];

export default function RangeSlider(props) {
  const classes = useStyles();
  const [trainSize, setTrainSize] = React.useState(90)
  const [testSize, setTestSize] = React.useState(10)

  const handleChange = (e,value) => {        
    setTrainSize(parseInt(value))
    setTestSize((100 - parseInt(value)))    
    props.handleSplit((testSize / 100))
    console.log(testSize)
  }

  return (
    <div className={classes.root}>

      <Grid item xs={12} md={8} lg={12}>
        <FormControl component="fieldset">
        <QuestionTitle>{props.title}</QuestionTitle>
          <div className={classes.space}>
            <PrettoSlider valueLabelDisplay="auto" onChange={(e,value)=>handleChange(e,value)}  defaultValue={90} step={null} marks={marks} />
          </div>
          <h4 >{trainSize}% with {testSize}% of train.</h4>
        </FormControl>
      </Grid>
    </div>
  );
}