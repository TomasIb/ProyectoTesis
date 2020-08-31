import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import QuestionTitle from './QuestionTitle';
// import Zoom from '@material-ui/core/Zoom';

function CheckboxForm(props) {
    return (
        
            <Grid item xs={12} md={8} lg={12}>
                <FormControl component="fieldset" disabled={props.loading} >
                    <QuestionTitle>{props.title}</QuestionTitle>                    
                    <p>Selected <b>{props.checkedTotal}</b> of <b>{props.itemTotal}</b></p>
                    <List disablePadding={true} style={{
                        height:'auto',
                        maxHeight: 300,
                        overflowY: 'scroll'
                    }} >
                        {props.options.map((option, index) =>
                            <ListItem key={index} >
                                <Checkbox  color="secondary" checked={!props.itemChecked[index]} key={index} onChange={(e, option) => props.handleChangeCheckbox(index, option.name)} value={option.name} />
                                <ListItemText
                                    id={option.name}
                                    primary={option.name}
                                />
                            </ListItem>
                        )}
                    </List>
                    <FormControlLabel
                        control={<Switch checked={props.selectAll} onChange={props.handleSelectAll} />}
                        label="Select All"
                    />
                </FormControl>
            </Grid>
        
    )
}
export default CheckboxForm;