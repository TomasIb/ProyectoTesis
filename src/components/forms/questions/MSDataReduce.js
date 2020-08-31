import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

function MSDataReduce(props) {
  const classes = useStyles();
  const { handleMassSpectrometry, params } = props;
  const [value, setValue] = React.useState(params.dataReduce.name)
  const handleRadioChange = (event) => {
    setValue(event.target.value);
    handleMassSpectrometry('dataReduce', 'name', event.target.value);    
    
    props.forceUpdate();
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <List className={classes.root}>
          <RadioGroup value={value} onChange={handleRadioChange}>

            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Radio value="Alignment" name="radio-button-demo" inputProps={{ 'aria-label': 'A' }} />
              </ListItemAvatar>
              <ListItemText
                primary="Alignment"
                className={classes.listText}
                secondary={
                  <React.Fragment>
                    {"Constructs a matrix of normalized intensities located based on intervals sigma errors."}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem >
              <ListItemAvatar>
                <Radio value="Binning" name="radio-button-demo" inputProps={{ 'aria-label': 'A' }} />
              </ListItemAvatar>

              <ListItemText
                primary="Binning"
                className={classes.listText}
                secondary={
                  <React.Fragment>
                    {"Constructs a matrix of normalized intensities with reduced dimensions equals to masses's mean contained in each bin."}
                  </React.Fragment>
                }
              />
            </ListItem>




          </RadioGroup>

        </List>
      </Grid>
    </React.Fragment>
  );
}
export default MSDataReduce;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  textTitle: {
    color: 'black',
    opacity: .8
  }
}));