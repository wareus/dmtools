import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';
import CharaterList from "./CharacterList"
import Profile from "./Profile"
import Header from "./Header"

class App extends Component {
  render() {
    return (
      <div>
          <Header/>
          <Switch>
              <Route exact path='/' component={CharaterList}/>
              <Route path='/profile' component={Profile}/>
          </Switch>
      </div>
    );
  }
}

export default App;
