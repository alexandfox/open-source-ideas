import React, { Component }  from 'react';
import './styles/scss/main.scss';
import { Switch, Route, Redirect } from "react-router-dom";
import NavMain from "./components/NavMain";
import AuthService from './api/auth-service';

import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import CreateIdea from "./pages/CreateIdea"
import IdeaPage from "./pages/IdeaPage"

class App extends Component {
  constructor(props){
    super(props)
    this.state = { 
      loggedIn: false,
      loggedUser: null
    };
    this.service = new AuthService();
  }

  fetchUser(){
    if( this.state.loggedUser === null ){
      this.service.loggedin()
      .then(response =>{
        this.setState({
          loggedUser:  response
        }) 
      })
      .catch( err =>{
        this.setState({
          loggedUser:  false
        }) 
      })
    }
  }

  getUser= (userObj) => {
    this.setState({
      loggedIn: true,
      loggedUser: userObj
    }, () => {
      console.log("User is logged in! state: ", this.state)
    })
  }

  render() {
    this.fetchUser()
    return (
      <div className="App">
        <NavMain loggedIn={this.state.loggedIn} />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" render={() => <Signup getUser={this.getUser}/>} />
            <Route exact path="/login" render={() => (this.loggedIn ? (<Redirect to="/" />) : (<Login getUser={this.getUser}/>))} />
            <Route exact path="/create-idea" component={CreateIdea} />
            <Route exact path="/idea/:id" render={(props) => <IdeaPage loggedUser={this.state.loggedUser} {...props} />} />
          </Switch>
        </main>
      </div>
  )};
}

export default App;
