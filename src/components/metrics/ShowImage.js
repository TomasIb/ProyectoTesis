import React from 'react';
import MainDialog from './MainDialog';
export default function ImageDialog(props) {    
    return (
        <MainDialog title={''} subtitle={''} {...props}>          
                <img alt="..." src={`data:image/png;base64,${props.encodedData}`} style={{ height: 550, width: 550 }} />            
        </MainDialog>
    );

}