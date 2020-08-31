import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';


function MSIonTecniqueForm(props) {
  const classes = useStyles();
  const { handleMassSpectrometry , params}= props;  
  const [value,setValue] = React.useState(params.ionTechnique.name)
  const handleRadioChange = (event) => {
    setValue(event.target.value); 
    handleMassSpectrometry('ionTechnique','name',event.target.value,props.step)    
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
                <Radio value="MALDI-TOF" name="radio-button-demo" inputProps={{ 'aria-label': 'A' }} />
              </ListItemAvatar>
              <ListItemText
                primary="MALDI-TOF"
                className={classes.listText}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      Matrix-Assisted Laser Desorption Ionization Time of Flight
              </Typography>
                    {" — use 10 bin size by default"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem >
              <ListItemAvatar>
                <Radio value="ESI" />
              </ListItemAvatar>
              <ListItemText
                primary="ESI"
                className={classes.listText}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      Electrospray Ionization
              </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
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
export default MSIonTecniqueForm;


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  listText: {
    color: 'black',
    opacity: .8
  }
}));
