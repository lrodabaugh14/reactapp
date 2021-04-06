import './App.css';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Game from './Game'
class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {},
    };
  };
    render() {
    

      return (
        <Router>
        <Route path="/Game/:gameCode/:player" component={Game}/>
        </Router>

      )
    }
}

export default ComponentToPrint;
