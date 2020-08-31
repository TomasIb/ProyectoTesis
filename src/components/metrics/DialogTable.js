import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MainDialog from './MainDialog';

function DialogTable(props) {
    return (
        <MainDialog title={props.data.title} subtitle={props.data.subtitle} {...props}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        {props.data.headers.map((col, index) => (
                            <TableCell key={index}>{col}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                {props.data.subtitle === 'SMOTE' ?
                    <TableBody>
                        {props.data.index.map((row, index) => (
                            <TableRow >
                                <TableCell key={index}>{row}</TableCell>

                                {props.data.values.map((row, i) => (
                                    <TableCell key={i}>{row[index]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                    :
                    <TableBody>
                        <TableRow >
                            {props.data.values.map((row, index) => (
                                <TableCell key={index}>{row}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                }
            </Table>
        </MainDialog>
    );
}
export default DialogTable;