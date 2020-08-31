import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import MainDialog from './MainDialog';



export default function ColumnsList(props) {
    return (
        <MainDialog title={props.data.type} subtitle={'Columns Names'} {...props}> 
                <List  style={{  width: 300,maxHeight:300 }} >
                    {props.data.columns.map((item, index) => (
                        <ListItem style={{textAlign:"center"}}    key={index}>
                           {props.data.type === 'Feature Selector'? <ListItemText style={{textAlign:"center"}} primary={item.name }   secondary={item.type} /> : <ListItemText primary={item} />}
                        </ListItem>
                    ))}
                </List>                        
        </MainDialog>

    );
}


