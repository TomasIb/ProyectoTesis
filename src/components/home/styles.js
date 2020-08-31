import {fade} from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
    root: {
      display: "flex",
      height: "100vh"
    },
    appBarSpacer: theme.spacing(3),
    bigImage: {
      borderRadius: 50,
      width: 500,
    },
    gridImages: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    form: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(6),
    },
    paper: {
      marginTop: theme.spacing(5),
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
  
    dropzone: {
      marginBottom: theme.spacing(5),
      display:'flex',
      justifyItems:"center",
      alignItems:"center"

    },
    submit: {
      marginTop: theme.spacing(5),
      display: 'flex',
  
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontFamily: 'Paytone One',
      color: "#083232",
    },
    subtitle: {
      fontFamily: 'Helvetica Neue',
      fontWeight: 400,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      textAlign: 'center',
      color: "#083232",
      borderRadius: 100,
      backgroundColor: fade('#ffd36f', 0.15),
    },
    imagestitles: {
      fontFamily: 'Paytone One',
      fontWeight: 400,
      color: "#083232",
      borderRadius: 100,
      backgroundColor: fade('#ffd36f', 0.15),
    },
    brand: {
      fontFamily: 'Paytone One',
      color: "#083232",
      textAlign: 'start',
      margin: theme.spacing(6, 4),
    },
   
  }));

  export default styles;