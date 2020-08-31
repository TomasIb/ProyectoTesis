import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
// import SaveIcon from '@material-ui/icons/Save';
// import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const actions = [
  // { icon: <SaveIcon color="secondary"  />, name: 'Save' },
  { icon: <HomeIcon color="secondary"  />, name: 'Back Home' },
  // { icon: <DeleteIcon color="error" />, name: 'Delete' },
];

export default function FloatingActionsButton(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (e,action) => {
    
    if(action==="Delete"){
      
     props.setConfirmEraseModal(true)

    }
    if(action==="Back Home"){
      
     props.setConfirmEraseModal(true)

    }
    if(action==="Save"){
      
      const downloadFile = {}
      downloadFile['client']= localStorage.getItem('client')
      downloadFile['metrics'] = localStorage.getItem('metrics')
      
      
      const date = new Date() 
      var month = date.getUTCMonth() + 1; 
      var day = date.getUTCDate();
      var year = date.getUTCFullYear();

      
      let filename = 'analysis'+day+month+year+'.json';
      let contentType = "application/json;charset=utf-8;";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(downloadFile)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(downloadFile));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        }
    }
    if(action==="Print"){
        console.log(action)
    }
    setOpen(false);

  };

  return (
    <div style={{position:"fixed",right:0,bottom:15,zIndex:"1400"}}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        className={classes.speedDial}
        hidden={false}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
        style={{opacity:.8}}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}            
            tooltipOpen            
            onClick={e=>handleClose(e,action.name)}
          
          />
        ))}
      </SpeedDial>
    </div>
  );
}