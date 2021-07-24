import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import InputPage from 'pages/input-page/input-page';
import Header from 'components/header/header';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/input" />
        <Route path="/input" component={InputPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
