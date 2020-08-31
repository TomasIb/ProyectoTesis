import React from 'react';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

export const styles = theme => ({
    copyRightButton: {
        fontFamily: 'Helvetica Neue,',
        fontWeight: 500,
        textAlign: 'center',
        color: "#083232",
        borderRadius: 100,
        backgroundColor: fade('#1d8cf8', 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.15)
        }
    }
});


export const CopyrightImages = ({ author, authorhref, company, companyhref }) => {
    return (
        <Grid direction="row">
            <Button size="small" aria-setsize={5} className={styles.copyRightButton} href={authorhref}>{author}</Button>
            <small>from</small>
            <Button size="small" aria-setsize={5} className={styles.copyRightButton} href={companyhref}>{company}</Button>
        </Grid>
    );

}