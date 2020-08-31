import materialTheme from './theme'
import { makeStyles } from '@material-ui/core/styles';

const snackStyles = makeStyles(() => ({
    success: { backgroundColor: materialTheme.palette.success.main,fontWeight:650 },
    warning: { backgroundColor: materialTheme.palette.warning.main, color: '#083232',fontWeight:650 },
    info: { backgroundColor: materialTheme.palette.info.main ,fontWeight:650},
}));
  
export default snackStyles;