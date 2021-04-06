import './App.css';
import React from 'react'
import Button from 'react-bootstrap/Button'
import firebase from './firebase.js'
import Card from './Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from "prop-types";
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.discardCard = this.discardCard.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.takeKick = this.takeKick.bind(this);
    this.takeWeakness = this.takeWeakness.bind(this);
    this.discardHand = this.discardHand.bind(this)
    this.state = {
      game: {},
      saving: false
    };
  };
  static propTypes = {
      match: PropTypes.object.isRequired,
      player: PropTypes.number.isRequired
  }
  shuffleDeck(gameCode, playerNumber) {
      var player = this.state.game.Players[playerNumber];
      var gameDB = firebase.database().ref().child('Game').child(gameCode);
      gameDB.child('Saving').set('True').then(() => {

        var playerdb = gameDB.child('Players').child(playerNumber)
        var drawStack = player.DrawStack;
        var discard = player.Discard;
        if (discard) {
          var newStack = [];
          if (drawStack && drawStack.constructor === Array) {
              newStack = [...drawStack,...discard];
          } else {
              newStack = discard;
          }
          playerdb.child('DrawStack').set(this.shuffle(newStack));
          playerdb.child('Discard').remove().then(() => {
            gameDB.child('Saving').set('False')
          });
      }
      });
  }
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  discardHand(gameCode, playerNumber) {
    var player = this.state.game.Players[playerNumber];
    var list = [];
    for(var i = 0; i < player.Hand.length; i++) {
      list[i] = player.Hand[i].CardId;
    }
    
    for(var t = 0; t < list.length; t++) {
      this.discardCard(gameCode, playerNumber, list[t]);
    }
  }
  discardCard(gameCode, playerNumber, cardId) {
      if (cardId !== 0) {
        var gameDB = firebase.database().ref().child('Game').child(gameCode);
        gameDB.child('Saving').set('True').then(() => {
        var player = this.state.game.Players[playerNumber];
        var playerdb = firebase.database().ref().child('Game').child(gameCode).child('Players').child(playerNumber);
        var newDiscard = [];
        if (player.Discard) {
            newDiscard = player.Discard;
            newDiscard[player.Discard.length] =player.Hand.find((x) => x.CardId === cardId);
        } else {
            newDiscard = [player.Hand.find((x) => x.CardId === cardId)];
        }
        
        for( var i = 0; i < player.Hand.length; i++){ 
            if (player.Hand[i].CardId === cardId) {
                player.Hand.splice(i,1);
                i = 100;
            }
        }
        playerdb.child('Discard').set(newDiscard);
        playerdb.child('Hand').set(player.Hand).then(() => {
          gameDB.child('Saving').set('False')
        });;
      });
    }
  }
  checkSave () {
    return this.state.game.Saving === 'True';
  }
  drawCard(gameCode, playerNumber) {
    var gameDB = firebase.database().ref().child('Game').child(gameCode);
    gameDB.child('Saving').set('True').then(() => {
      var player = this.state.game.Players[playerNumber];
      var playerdb = firebase.database().ref().child('Game').child(gameCode).child('Players').child(playerNumber);
      if (player.DrawStack && player.DrawStack.constructor === Array) {
          if (player.Hand) {
            player.Hand[player.Hand.length] = player.DrawStack.pop();      
          } else {
              player.Hand = [player.DrawStack.pop()];
          }
                playerdb.child('DrawStack').set(player.DrawStack);
      playerdb.child('Hand').set(player.Hand).then(() => {
        gameDB.child('Saving').set('False')
      });
    } else {
      gameDB.child('Saving').set('False');

    }
    });
}
takeKick(gameCode, playerNumber) {
  var gameDB = firebase.database().ref().child('Game').child(gameCode);
  gameDB.child('Saving').set('True').then(() => {
  var player = this.state.game.Players[playerNumber];
  var playerdb = firebase.database().ref().child('Game').child(gameCode).child('Players').child(playerNumber);
  if (player.Discard && player.Discard.constructor === Array) {
    player.Discard[player.Discard.length] = this.state.game.Kicks[0];
  } else {
    player.Discard = [];
    player.Discard[0] = this.state.game.Kicks[0];
  }
  playerdb.child('Discard').set(player.Discard).then(() => {
    gameDB.child('Saving').set('False')
  });
});
}
takeWeakness(gameCode, playerNumber) {
  var gameDB = firebase.database().ref().child('Game').child(gameCode);
  gameDB.child('Saving').set('True').then(() => {
  var player = this.state.game.Players[playerNumber];
  var playerdb = firebase.database().ref().child('Game').child(gameCode).child('Players').child(playerNumber);
  if (player.Discard && player.Discard.constructor === Array) {
    player.Discard[player.Discard.length] = this.state.game.Weakness[0];
  } else {
    player.Discard = [];
    player.Discard[0] = this.state.game.Weakness[0];
  }
  playerdb.child('Discard').set(player.Discard).then(() => {
    gameDB.child('Saving').set('False')
  });
});
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
        this.setState(
          {
            gameCode: gameCode,
            playerNumber: params.player -1
          }
        );
      const game = firebase.database().ref().child('Game').child(gameCode);
      console.log(gameCode);
      game.on('value', (snapshot) =>{
        let games = snapshot.val();
        this.setState({
          game: games
        });
      });
    }
    render() {
        const { match: { params } } = this.props;
        var gameCode = params.gameCode;
        var player = Number(params.player) - 1;
        var user = this.state.game?.Players ? this.state.game.Players[player] : 0;
        var vp = 0;
        if (user) {
          if (user.Discard && user.Discard.constructor === Array) {
            user.Discard.forEach((x) => {
              vp += x.VictoryPoints;
            });
          } 
          if (user.Hand && user.Hand.constructor === Array) {
            user.Hand.forEach((x) => {
              vp += x.VictoryPoints;
            });
          } 
          if (user.DrawStack && user.DrawStack.constructor === Array) {
            user.DrawStack.forEach((x) => {
              vp += x.VictoryPoints;
            });
          } 
        }
      var newPurchaseRow = [];
      if (this.state.game.PurchaseRow) {
        this.state.game.PurchaseRow?.map((p)=> {
          newPurchaseRow.push(p);
        })
        if (newPurchaseRow.length < 5) {
        
        var mainDeck = this.state.game.MainDeck;
        if (mainDeck) {
          var nextCard = mainDeck.length - 1;
          var cardFromDeck = mainDeck[nextCard];
          newPurchaseRow.push(cardFromDeck);
        firebase.database().ref().child('Game').child(gameCode).child('PurchaseRow').set(newPurchaseRow);
        firebase.database().ref().child('Game').child(gameCode).child('MainDeck').child(nextCard).remove();
        }
        
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
                <Button disabled={this.state.game.Saving === 'True'} onClick={this.discardCard.bind(this, gameCode, player,p.CardId) }>Discard</Button>
                </div>
              )

            }): null}
                         

            </div>
            <div class="row">
            {user ? <div class="col-md-3 card">
                <div class="card-header">
                {user.Persona.CardName}
                <div class="float-right">{vp}</div>
                    </div>
                    <div class="card-body">
                    {user.Persona.CardText}
                        </div>
                        <div class="card-footer">
                        <Button disabled={this.state.game.Saving === 'True'} onClick={this.drawCard.bind(this, gameCode, player)}>Draw Card ({user.DrawStack?.length})</Button>
                        <Button disabled={this.state.game.Saving === 'True'} onClick={this.shuffleDeck.bind(this, gameCode, player)}>Shuffle Discard</Button>
                        <Button  disabled={this.state.game.Saving === 'True'} onClick={this.discardHand.bind(this, gameCode, player)}>Discard Hand</Button>
                        </div>
                </div>: null}
                <div class="form-group col-md-2">
                  <Button class="p-2 m-2 col-md-12" disabled={this.state.game.Saving === 'True'} onClick={this.takeKick.bind(this, gameCode, player)}>Take Kick</Button>
                  <Button class="p-2 m-2 col-md-12"  disabled={this.state.game.Saving === 'True'} onClick={this.takeWeakness.bind(this, gameCode, player)}>Take Weakness</Button>
                </div>
                </div>
          </div>
          </div>
      )
    }
}

export default Game;
