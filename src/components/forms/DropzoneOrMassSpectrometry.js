import React, { useState } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import AttachFile from '@material-ui/icons/AttachFile';
import Zoom from '@material-ui/core/Zoom';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

function DropzoneOrMassSpectrometry(props) {
    const classes = useStyles();
    const [fileName, setFileName] = useState('');

    const handleDropZone = (file) => {
        if (file.length > 0) {            
            setFileName(file[0].name)
            props.handleUploadFile(file)
        }
    };
    
    const handleDelete = () => {        
        setFileName('')
        props.handleDeleteFile()
    };

    return (
        <div>
            
                <DropzoneArea
                    onChange={handleDropZone}
                    dropzoneText={''}
                    showFileNames={true}
                    filesLimit={1}
                    acceptedFiles={["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "text/csv"]}
                    showPreviewsInDropzone={false}
                    dropzoneParagraphClass={classes.switch}
                    dropzoneClass={props.fileUploaded ?classes.hideDropzone :classes.paper}
                    fullWidth={true}
                />
            {props.fileUploaded ?
                <React.Fragment>
                    <Zoom in={true} style={{ '500ms': '0ms' }}>
                        <div className={classes.filePlacement}>
                            <Grid container spacing={3}   >
                                <Grid item xs={12} md={12} lg={12}>
                                    <Chip icon={<AttachFile />} label={fileName} onDelete={handleDelete} color="default" on="true" />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        labelPlacement="end"
                                        label={<Typography  variant="subtitle1" color="textSecondary" gutterBottom>Parse Mass Spectrometry Dataset?</Typography>}
                                        control={
                                            <Switch
                                                aria-controls="fade-menu"
                                                name="isMsDataset"
                                                className={classes.iconButton}
                                                color="primary" onChange={props.handleSwitchChange}
                                                checked={props.isMsDataset}
                                            />
                                        }
                                    />
                                </Grid>                               
                            </Grid>
                        </div>
                    </Zoom>
                </React.Fragment>
            :null}
        </div>
    )
}

export default DropzoneOrMassSpectrometry;


const useStyles = makeStyles((theme) => ({
    paper: {
        alignItems: 'center',
        backgroundColor: "transparent",
        borderRadius: '25px',
        opacity: '100%',
        width: 500,
        height: 300,
        justifyContent: 'center',
        display: "flex" 
    },
    hideDropzone:{
        display:"none"
    },
    switch: {
        color: '#ffffff',
        width: '100%',
        fontFamily: "Poppins",
    },
    filePlacement: {
        direction: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));