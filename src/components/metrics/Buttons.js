import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles';

export const ActionButton = withStyles((theme) => ({
    root: {
        fontWeight:600,
        fontSize:10,
        maxHeight:20,
        maxWidth:200,        
        borderRadius: 50,        
        backgroundColor: fade('#1d8cf8', 0.25),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.15),
    },
}}))(Button);

export const LinkButton = withStyles((theme) => ({
    root: {
        fontWeight:800,
        fontSize:10,
        borderRadius: 50,
        maxHeight:40,
        maxWidth:120, 
        backgroundColor: fade('#ffd36f', 0.50),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.15),
    },
}}))(Button);


