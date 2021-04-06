import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react'
import firebase from './firebase.js'
import { render } from '@testing-library/react';
import Card from './Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Game from './Game'
var gameCode = '-MXXtXondWNvQD-Jfjo0' 
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
