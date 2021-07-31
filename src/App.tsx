import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import InputPage from 'pages/input-page/input-page';
import Header from 'components/header/header';
import './App.css';
import { MuiThemeProvider } from '@material-ui/core';
import theme from 'theme';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Switch>
          <Redirect exact from="/" to="/input" />
          <Route path="/input" component={InputPage} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
