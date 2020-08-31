import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import materialTheme from './styles/theme';
import snackStyles from './styles/snackStyles';
import { connect } from "./services/socket";
import Layout from './components/layouts/Layout';
import HomePage from './views/HomePage';
import MetricsPage from './views/MetricsPage';
import LoadingPage from './views/LoadingPage';

export default function App() {
  document.title = "Pipe - Tomás Ibáñez Tesis 2020"
  const classes = snackStyles();
  const [socketReady, setSocketReady] = React.useState(false)
  
  connect(status => {
    setSocketReady(true)
  });


  

  if (socketReady) {
    return (
      <ThemeProvider theme={materialTheme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={8000} classes={{
          variantSuccess: classes.success,
          variantWarning: classes.warning,
          variantInfo: classes.info,
        }}>
          <Switch>
            <Route exact path='/' component={Layout(HomePage)} />
            <Route exact path='/metrics' component={MetricsPage} />
            <Route exact path='/loading' component={Layout(LoadingPage)} />
          </Switch>
          <Redirect to="/" />          
        </SnackbarProvider>

      </ThemeProvider>
    );
  } else {
    return <LoadingPage type={'loading'} /> //En un futuro, reemplaza por splash screen
  }
}