import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

root: {
  display: 'flex',
  height: '100vh',
},
content: {
  flexGrow: 1,
  position: 'inherit',
  overflow: 'auto',

},
container: {  
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(6),

},
paper: {
  padding: theme.spacing(0.5),
  paddingTop: theme.spacing(1),
  display: 'flex',
  overflow: 'auto',                    
  flexDirection: 'column',
},
fixedHeight: {
  height: 270,
  alignItems: "center",        

},
centerLoading: {
  justifyContent: "center",
  alignContent: 'center',
  alignItems: 'center',
  display: 'flex',
  marginLeft: theme.spacing(40),

},
author: {
  marginTop: theme.spacing(6),
  marginRight: theme.spacing(0),  
  position: 'relative',
  fontWeight: 500,
  fontSize:13,
},
brand: {
  fontFamily: 'Paytone One',
  color: "#083232",
  textAlign: 'start',
  marginTop: theme.spacing(4),
  marginLeft: theme.spacing(4),
},
rootTitle: {
  marginTop: theme.spacing(1),
  marginLeft: theme.spacing(4),
  fontWeight: 600,
  color: "#083232",
  textAlign: 'start',
},
titleMetrics: {
  fontWeight: 600,
  marginTop: 50,
  color: "#083232",
  marginLeft: theme.spacing(2),

},
subtitleMetrics: {
  fontWeight: 600,
  color: "#083232",
  marginBottom: 30,
  marginLeft: theme.spacing(2),
},

imageResults: {
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(2),
},
}));

export default useStyles;

