import Button from 'react-bootstrap/Button';
import React from 'react'
import firebase from './firebase.js'
class DeckFunctions extends React.Component {

    buyCard(cardId) {
        var player = this.props.player;
        var game = this.props.gameCode;
        var gameDB = firebase.database().ref().child('Game').child(game);
        
        var purchaseRowDB = gameDB.child('PurchaseRow');
        var villainStackDB = gameDB.child('SuperVillains');
        var villainUPDB = gameDB.child('SuperVillian');
        var playerDiscardDB = gameDB.child('Players').child(player).child('Discard');
        let purchaseRow = []
        let discard = [];
        let villainStack = [];
        let villain = {};
        purchaseRowDB.on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            purchaseRow = data;
          });;
          villainStackDB.on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            villainStack = data;
          });;
          villainUPDB.on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            villain = data;
          });;
        
          playerDiscardDB.on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            discard = data;
          });;
        var newPurchaseRow = [];
        var boughtCard = {};
        var newDiscard = [];
        if (discard && discard.propertyIsEnumerable()){
            newDiscard = [...discard];
        }
        var i = 0;
        var newVillain = {};
        if (villain.CardId === cardId) {
            newDiscard[newDiscard.length] = villain;
            playerDiscardDB.set(villain);

            if (villainStack && villainStack.propertyIsEnumerable()) {

                newVillain = villainStack.pop();
                villainUPDB.set(newVillain);
                villainStackDB.set(villainStack);
            } else {
                villainUPDB.remove();
            }
        } else {
            purchaseRow.forEach(card => {
                if (card.CardId !== cardId) {
                    newPurchaseRow[i] = card;
                    i++;
                } else {
                    boughtCard = card;
                    cardId = 0; 
                }
            });
            newDiscard[newDiscard.length] = boughtCard;
            purchaseRowDB.set(newPurchaseRow);
            playerDiscardDB.set(newDiscard);
        }
    }
    render () {
        return ( 
            <Button onClick={this.buyCard.bind(this, this.props.cardId)}>Buy</Button>
            )
    }
}
export default DeckFunctions;