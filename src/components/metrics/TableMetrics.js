import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core'
import Title from './Title';
import TableContainer from '@material-ui/core/TableContainer';
import { ActionButton } from './Buttons';

const useToolbarStyles = makeStyles((theme) => ({

  title: {
    display: 'inline-flex',
    alignItems: 'flex-start'
  },
}));


const ToolBarTitle = (props) => {
  const classes = useToolbarStyles();
  return (
    <div>
      <Title >{props.type} Metrics </Title>
      {props.type === 'Train' ?
        <div className={classes.title} >
          <Typography color="inherit" variant="subtitle1" >
            <small>Train and GridSearch Time: {props.trainTime} seg</small>
          </Typography>
        </div>

        : null}
    </div>
  );
};


export default function TableMetrics(props) {

  return (
    <React.Fragment>
      <ToolBarTitle {...props} />
      {props.isMultiClass ?
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell> Algorithm</TableCell>
                <TableCell>Accuracy</TableCell>
                <TableCell>MCC</TableCell>
                <TableCell>Sensitivity</TableCell>
                {/* <TableCell >Specificity</TableCell> */}
                {/* <TableCell >VPN</TableCell> */}
                <TableCell >VPP</TableCell>
                <TableCell >GridSearch</TableCell>
                <TableCell >Conf. Matrix</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.ALGNAME}</TableCell>
                  <TableCell>{row.ACCU}</TableCell>
                  <TableCell>{row.MCC}</TableCell>
                  <TableCell>{row.SENS}</TableCell>
                  {/* <TableCell >{row.SPEC}</TableCell> */}
                  {/* <TableCell >{row.VPN}</TableCell> */}
                  <TableCell >{row.VPP}</TableCell>
                  {row.GRIDSEARCH === undefined || row.GRIDSEARCH.length > 0 ?
                    <TableCell >
                      <ActionButton size="small" onClick={(e) => props.seeGridSearch(row.GRIDSEARCH, row.ALGNAME)}>
                        <small> See Values </small>
                      </ActionButton>

                    </TableCell>
                    :
                    <TableCell><small> Not Needed </small></TableCell>
                  }
                  <TableCell >
                    <ActionButton size="small" onClick={(e) => props.seeConfusionMatrix(row.CMBINARY)} style={{ alignContent: "center", justifyContent: "center", display: "flex" }}>
                      <small>  See Matrix  </small>
                    </ActionButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Algorithm</TableCell>
                <TableCell>Accuracy</TableCell>
                <TableCell>MCC</TableCell>
                <TableCell>Sensitivity</TableCell>
                <TableCell >Specificity</TableCell>
                <TableCell >VPN</TableCell>
                <TableCell >VPP</TableCell>
                <TableCell >GridSearch</TableCell>

                {props.type === "Train" ? <TableCell >Conf. Matrix</TableCell> : null}
              </TableRow>

            </TableHead>
            <TableBody>
              {props.data.map((row, index) => (
                <TableRow key={index}>
                  {row.ISBEST === true ?
                    <React.Fragment>
                      <TableCell><b>{row.ALGNAME}</b></TableCell>
                      <TableCell><b>{row.ACCU}</b></TableCell>
                      <TableCell><b>{row.MCC}</b></TableCell>
                      <TableCell><b>{row.SENS}</b></TableCell>
                      <TableCell ><b>{row.SPEC}</b></TableCell>
                      <TableCell ><b>{row.VPN}</b></TableCell>
                      <TableCell ><b>{row.VPP}</b></TableCell>
                    </React.Fragment>
                    : <React.Fragment>
                      <TableCell>{row.ALGNAME}</TableCell>
                      <TableCell>{row.ACCU}</TableCell>
                      <TableCell>{row.MCC}</TableCell>
                      <TableCell>{row.SENS}</TableCell>
                      <TableCell >{row.SPEC}</TableCell>
                      <TableCell >{row.VPN}</TableCell>
                      <TableCell >{row.VPP}</TableCell>
                    </React.Fragment>
                  }
                  {row.GRIDSEARCH === undefined || row.GRIDSEARCH.length > 0 ?
                    <TableCell >
                      <ActionButton size="small" onClick={(e) => props.seeGridSearch(row.GRIDSEARCH, row.ALGNAME)}>
                        <small> See Values </small>
                      </ActionButton>
                    </TableCell>
                    :
                    <TableCell><small>Not Needed</small></TableCell>
                  }
                  {props.type === "Train" ?
                    <TableCell >
                      <ActionButton size="small" onClick={(e) => props.seeConfusionMatrix(row.CMBINARY)}>
                        <small> See Matrix </small>
                      </ActionButton>
                    </TableCell>
                    : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </React.Fragment>
  );

}