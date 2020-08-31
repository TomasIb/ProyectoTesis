import React from "react";
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import QuestionTitle from './QuestionTitle';

function RadioForm(props) {
    return (
        <Grid item xs={12} md={8} lg={12}>
            <FormControl style={{ display: 'flex', flex: 1, marginRight: '10px', marginLeft: '10px' }} component="fieldset" disabled={props.loading}>
                <FormGroup >
                    <QuestionTitle>{props.title}</QuestionTitle>
                    <RadioGroup aria-label={props.stepName} name={props.title} onChange={props.handleChangeRadio} value={props.selected} >
                        {props.options.map((option, index) =>
                            <ListItem button key={index}>
                                <FormControlLabel value={JSON.stringify(option)} control={<Radio color="secondary" />} label={<ListItemText primary={option.name} secondary={option.params && props.parameterSelected && option.params.type + ': ' + option.params.choices.find(p => p.name === JSON.parse(props.parameterSelected).name).name} />} />
                            </ListItem>
                        )}
                    </RadioGroup>
                </FormGroup>
            </FormControl>
        </Grid>

    )
}
export default RadioForm;
