import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RadioForm from './RadioForm';
import RangeSlider from './RangeSlider';
import CheckboxForm from './CheckboxForm';
import ModalParams from './ModalParams';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom"
import { useSnackbar } from 'notistack';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { getErrors, postErrors } from 'constants/errors';
import { apiService } from 'services/apiService';
import { pipeSteps } from 'services/questions/steps';
import { useQuestionStep } from 'hooks/useQuestionStep'

const error = createMuiTheme({ palette: { primary: red } })
function Questions(props) {
    const history = useHistory();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const questionStep = useQuestionStep(pipeSteps[0].name, "Set the train size of the dataset. The rest will be used to validate the best model.", false, false, {}, 0, 0);    
    const [buttonText, setButtonText] = useState('Next Step');
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);

    const [showModalParams,setShowModalParams] = useState(false);
    const [algorithmParameters,setAlgorithmParameters] = useState({});
    const [selectedAlgorithmParameter,setSelectedAlgorithmParameter] = useState(null);

    const getQuestion = async (callQuestion,index) => {        
        try {
            index = index + 1              
            const { question, pass } = await callQuestion(enqueueSnackbar)
            setZoom(true)    
            !pass && questionStep.setStep(question.name, question.title, question.choices,question.type)
            if (!pass && question.type === 'checkbox') { questionStep.setItems(question)}
            
            setStepIndex(index)
            if (pass) {                
                getQuestion(pipeSteps[index].nextGet,index)
                setStepIndex(index)
            }
        } catch (err) {
            enqueueSnackbar(getErrors[pipeSteps[stepIndex].name], { variant: 'error' })
            props.handleReset()
        }
    }

    const getformData = () => {
        const formData = new FormData();
        formData.append('option', pipeSteps[0].name === pipeSteps[stepIndex].name || pipeSteps[pipeSteps.length-2].name === pipeSteps[stepIndex].name ? questionStep.selected : JSON.parse(questionStep.selected).name)
        formData.append('parameter',selectedAlgorithmParameter && JSON.parse(selectedAlgorithmParameter).name )
        formData.append('mainPath', localStorage.getItem('client'))
        return formData
    }

    const postStep = async () => {
        setLoading(true);
        setZoom(false);
        questionStep.setDisableButtonNext(true);
        setButtonText('Loading');

        if (pipeSteps[stepIndex].name === "ML Algorithms") { history.push({ pathname: "/loading", state: { type: 'train' } }) }        
            const res = await apiService.post(pipeSteps[stepIndex].post, getformData())
            if (res.status === 200) {
                if (pipeSteps[stepIndex].name === "Feature Selector" && JSON.parse(questionStep.selected).name !== 'Do not select') { enqueueSnackbar('With ' + JSON.parse(questionStep.selected).name + ' Selected ' + res.data.features.selected + ' of ' + res.data.features.original, { variant: 'success' }) }
                if (pipeSteps[stepIndex].name !== "ML Algorithms") {
                    setLoading(false)                                      
                    setButtonText('Next Step')
                    questionStep.setSelected([])
                    questionStep.handleSetOptions([])
                    setStepIndex(prevIndex => prevIndex + 1)
                }
                pipeSteps[stepIndex + 1 ].name === 'Metrics' ? history.push({ pathname: "/metrics" }) : getQuestion(pipeSteps[stepIndex].nextGet,stepIndex)
            } else {
                enqueueSnackbar(postErrors[pipeSteps[stepIndex].name], { variant: 'error' })
                props.handleReset()
            }
     
    }

    const handleChangeRadio = (e) => {   
        const value = JSON.parse(e.target.value)
        if(value.params){
            setShowModalParams(true)
            setAlgorithmParameters(value.params)
            setSelectedAlgorithmParameter(JSON.stringify(value.params.choices[0]))
            questionStep.setSelected(JSON.stringify(value))            
        }else{
            setAlgorithmParameters({})
            setShowModalParams(false)
            questionStep.setSelected(JSON.stringify(value))            
            setSelectedAlgorithmParameter(null)
        }                
    }

    const handleChangeRadioParameter = (e) => {   
        setSelectedAlgorithmParameter(e.target.value)
    
    }
   
    const handleCloseModal = (e) => {   
        setShowModalParams(false)    
    }

    const handleSelectAll = () => {
        questionStep.handleSelectAll()
        questionStep.setDisableButtonNext(questionStep.selectAll)

    }

    const handleChangeCheckbox = (index) => {
        questionStep.handleCheckItem(index)        
    }

    const handleSplit = (split) => {
        questionStep.setSelected(split)
    }

    return (

        <React.Fragment>
            <Grid container spacing={2}
                direction="column"
                alignItems="center"
                justify="center"

            >
                <ModalParams open={showModalParams} handleClose={handleCloseModal} params={algorithmParameters} handleChangeRadioParameter={handleChangeRadioParameter} selectedAlgorithmParameter={selectedAlgorithmParameter}/>
                {questionStep.type === 'range-slider' ?
                    <RangeSlider title={questionStep.title} handleSplit={handleSplit} />
                    : null}
                {questionStep.type === 'radio'?
                    <RadioForm zoom={zoom} loading={loading} stepName={questionStep.stepName} title={questionStep.title} options={questionStep.options} handleChangeRadio={handleChangeRadio} selected={questionStep.selected} parameterSelected={selectedAlgorithmParameter}/>
                    : null}
                {questionStep.type === 'checkbox'?
                    <CheckboxForm
                        zoom={zoom}
                        loading={loading}
                        title={questionStep.title}
                        options={questionStep.options}
                        itemChecked={questionStep.itemChecked}
                        checkedTotal={questionStep.checkedTotal}
                        itemTotal={questionStep.itemChecked.length}
                        handleChangeCheckbox={handleChangeCheckbox}
                        handleSelectAll={handleSelectAll}
                        selectAll={questionStep.selectAll}
                        height={props.height}
                    />
                    : null}
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={6}>
                        <MuiThemeProvider theme={error}>
                            <Button variant="text" color="primary" size="small" className={classes.resetButton} onClick={props.handleOpenConfirmResetModal}>
                                <small>Reset Pipeline</small>
                            </Button>
                        </MuiThemeProvider>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" className={classes.submit} disabled={questionStep.disableButtonNext} onClick={postStep}>
                            {loading ? <CircularProgress color="inherit" /> : null}
                            {buttonText}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );

}

export default Questions;

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3),
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: "#e1e1e1",
        borderRadius: '25px',
        opacity: '40%',
        width: '100%',
        height: '100%',
        direction: 'column',
        justifyContent: 'center'
    },
    switch: {
        color: 'primary',
        width: '100%',
    },
    subtitle: {
        fontFamily: 'Karla',
        fontSize: '17px',
        color: '#313E5B',
        fontWeight: '700',
        lineHeight: '50px',
        labelPlacement: 'center',
        width: '100%',

    },
    filePlacement: {
        margin: 'auto',
        direction: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    submit: {
        borderRadius: '25px',
        margin: 'auto',
        color: 'white',
        fontWeight: '600',
    },
    resetButton: {
        color: 'red',

    }
}));