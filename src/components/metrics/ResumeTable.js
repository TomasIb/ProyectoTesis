import React from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import SubTitle from './SubTitle';
import { ActionButton } from './Buttons';


export default function ResumeTable(props) {
  const { metrics } = props;


  return (
    <React.Fragment>
      <Title>General Resume </Title>
      <SubTitle> {metrics.datasetType + ' ' + metrics.filename}</SubTitle>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Step</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Algorithm</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.resume.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.step}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  {row.algorithm}{"    "}
                  {row.algorithm === "Recursive Feature Elimination CV" ?
                    <React.Fragment>                      
                      <small>  {row.estimator} </small> 
                      
                      <ActionButton size="small" onClick={(e) => props.imageModal(row.chart)}>
                        See Chart
                    </ActionButton>
                    </React.Fragment>

                    : null}
                </TableCell>
                <TableCell >
                  {(row.affected !== "" && row.action) ?
                    <ActionButton size="small" onClick={(e) => row.step === 'Over Sample' ? props.openOverSample(row.choices, row.step) : props.seeColumnsSelectedModal(row.choices, row.step)}>
                      <small>{row.action}</small>
                    </ActionButton>
                    : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}