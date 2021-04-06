import Button from 'react-bootstrap/Button';
import React from 'react'
import firebase from './firebase.js'
class DeckFunctions extends React.Component {

    buyCard(cardId) {
        var player = this.props.player;
        var game = this.props.gameCode;
        var gameDB = firebase.database().ref().child('Game').child(game);
        var drawStackDB = gameDB.child('PurchaseRow');
        var playerDiscardDB = gameDB.child('Players').child(player).child('Discard');
        let drawStack = []
        let discard = [];
        drawStackDB.on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let d = {...data};
            drawStack = data;
          });;
          playerDiscardDB.on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let d = {...data};
            discard = data;
          });;
        var newDrawStack = [];
        var boughtCard = {};
        var newDiscard = [...discard];
        var i = 0;
        drawStack.forEach(card => {
            if (card.cardId !== cardId) {
                newDrawStack[i] = card;
                i++;
            } else {
                boughtCard = card;
                cardId = 0; 
            }
        });
        newDiscard[newDiscard.length] = boughtCard;
        drawStackDB.set(newDrawStack);
        playerDiscardDB.set(newDiscard);
    }
    render () {
        return ( 
            <Button onClick={this.buyCard.bind(this, this.props.CardId)}>Buy</Button>
            )
    }
}
export default DeckFunctions;