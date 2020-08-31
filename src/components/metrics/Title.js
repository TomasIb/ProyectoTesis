import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  
  title: {
    fontFamily: 'Paytone One',
    color: "#083232",
    opacity:.9
}
}));
export default function Title(props) {
  const classes = useStyles()
  return (
    <Typography  variant="h6" color="primary" className={classes.title}>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};