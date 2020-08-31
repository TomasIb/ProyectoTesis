import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  

  subtitle: {
    fontFamily: 'Helvetica Neue',
    fontWeight: 600,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(.5),    
    color: "#083232"
  }
}));


export default function Title(props) {
  const classes = useStyles();
  return (
    <Typography  variant="subtitle2" color="textSecondary" className={classes.subtitle} gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};