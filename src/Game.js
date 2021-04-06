import './App.css';
import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'
import firebase from './firebase.js'
import { render } from '@testing-library/react';
import Card from './Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from "prop-types";
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.discardCard = this.discardCard.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.state = {
      game: {},
    };
  };
  static propTypes = {
      match: PropTypes.object.isRequired,
      player: PropTypes.number.isRequired
  }
  shuffleDeck(gameCode, playerNumber) {
      var player = this.state.game.Players[playerNumber];
      var playerdb = firebase.database().ref().child('Game').child(gameCode).child('Players').child(playerNumber)
      var drawStack = player.DrawStack;
      var discard = player.Discard;
      if (discard) {
        var newStack = [];
        if (drawStack) {
            newStack = [...drawStack,...discard];
        } else {
            newStack = discard;
        }
        playerdb.child('DrawStack').set(newStack);
        playerdb.child('Discard').remove();
    }

  }

  discardCard(gameCode, playerNumber, cardId) {
      if (cardId !== 0) {
        var player = this.state.game.Players[playerNumber];
        var playerdb = firebase.database().ref().child('Game').child(gameCode).child('Players').child(playerNumber);
        var discardedCard = player.Hand.find((x) => x.CardId === cardId);
        var newDiscard = [];
        if (player.Discard) {
            newDiscard = player.Discard;
            newDiscard[player.Discard.length] =player.Hand.find((x) => x.CardId === cardId);
        } else {
            newDiscard = [player.Hand.find((x) => x.CardId === cardId)];
        }
        var newHand = [];
        for( var i = 0; i < player.Hand.length; i++){ 
            if (player.Hand[i].CardId === cardId) {
                newHand = player.Hand.splice(i,1);
                i = 100;
            }
        }
        playerdb.child('Discard').set(newDiscard);
        playerdb.child('Hand').set(player.Hand);
      }
  }
  drawCard(gameCode, playerNumber) {
      var player = this.state.game.Players[playerNumber];
      var playerdb = firebase.database().ref().child('Game').child(gameCode).child('Players').child(playerNumber);
      var newHand = [];
      var newDrawStack = [];

      if (player.DrawStack) {
          if (player.Hand) {
            player.Hand[player.Hand.length] = player.DrawStack.pop();      
          } else {
              player.Hand = [player.DrawStack.pop()];
          }
                playerdb.child('DrawStack').set(player.DrawStack);
      playerdb.child('Hand').set(player.Hand);
      } else {
      }

}

  shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }

    componentDidMount() {
        const { match: { params } } = this.props;
        var gameCode = params.gameCode;
        this.state.gameCode = gameCode;
        this.state.playerNumber = params.player - 1;
      const game = firebase.database().ref().child('Game').child(gameCode);
      console.log(gameCode);
      game.on('value', (snapshot) =>{
        let games = snapshot.val();
        for (let g in games) {
        }
        this.setState({
          game: games
        });
      });
    }
    render() {
        const { match: { params } } = this.props;
        var gameCode = params.gameCode;
        var player = Number(params.player) - 1;
        var user = this.state.game.Players ? this.state.game.Players[player] : 0;
      var newPurchaseRow = [];
      if (this.state.game.PurchaseRow) {
        var i = 0;
        this.state.game.PurchaseRow?.map((p)=> {
          newPurchaseRow.push(p);
        })
        if (newPurchaseRow.length < 5) {
        
        var mainDeck = this.state.game.MainDeck;
        var nextCard = mainDeck.length - 1;
        var cardFromDeck = mainDeck[nextCard];
        newPurchaseRow.push(cardFromDeck);
        firebase.database().ref().child('Game').child(gameCode).child('PurchaseRow').set(newPurchaseRow);
        firebase.database().ref().child('Game').child(gameCode).child('MainDeck').child(nextCard).remove();
      }
    }

      return (
        <div>
          <div class="purchaseRow col-md-12">
            <div class="row">
            {this.state.game.PurchaseRow?.map((p)=> {
              return( 
                <div class="col-md-2 m-0">
                <Card gameCode={gameCode} player={player} card={p} canBuy={true}></Card>
                </div>
              )
            })}
            <div class="super-villian col-md-2 m-0">{ this.state.game.SuperVillian ? <Card gameCode={gameCode} player={player} card={this.state.game.SuperVillian} canBuy={true}></Card> : null }
            </div>
            </div>

          </div>
          <div class="playerHand">
            <div class="row">
            {console.log(player)}             
            {user && user.Hand ? 

                user.Hand?.map((p)=> {
              return( 
                <div class="col-md-2 m-0">
                <Card card={p}></Card>
                <Button onClick={this.discardCard.bind(this, gameCode, player,p.CardId)}>Discard</Button>
                </div>
              )

            }): null}
                         

            </div>
            {user ? <div class="col-md-3 card">
                <div class="card-header">
                {user.Persona.CardName}
                    </div>
                    <div class="card-body">
                    {user.Persona.CardText}
                        </div>
                        <div class="card-footer">
                        <Button onClick={this.drawCard.bind(this, gameCode, player)}>Draw Card ({user.DrawStack?.length})</Button>
                        <Button onClick={this.shuffleDeck.bind(this, gameCode, player)}>Shuffle Discard</Button>
                        </div>
                </div>: null}

          </div>
          </div>
      )
    }
}

export default Game;
