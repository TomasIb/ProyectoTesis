import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  subtitle: {
    fontFamily: 'Helvetica Neue',
    fontWeight: 550,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    color: "#083232"
  }
}));


export default function QuestionTitle(props) {
  const classes = useStyles();
  return (
    <Typography   component="h5" variant="subtitle1" color="textSecondary" className={classes.subtitle} gutterBottom>
      {props.children}
    </Typography>
  );
}

QuestionTitle.propTypes = {
  children: PropTypes.node,
};