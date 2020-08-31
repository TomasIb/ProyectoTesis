import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Tomás Ibánez - Tesis 2020 UCM.
        </Link>{' '}
      <br />
        Profesora guía: Xaviera Lopez.
      {/* <br /><br />
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Vector images by icon8
        </Link>{' '} */}
    </Typography>
  );
}
