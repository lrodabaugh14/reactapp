import React from 'react'
import DeckFunctions from './deckFunctions'
import punch from './Cards/punch.JPG'
class Card extends React.Component {
    render() {
        var card= this.props.card;
        var gameCode = this.props.gameCode;
        var canBuy = false;
        
        var cardName = card.CardName.replace(' ', '%');
        var source = `./Cards/${card.CardName.replace(/\s/g, "").toLowerCase()}.JPG`;
        var imageUrl = "https://www.dcdeckbuilding.com/scans/" +  cardName + ".jpeg"
        if (this.props.canBuy) {
            canBuy = true;
        }
        var player = this.props.player; 
        return (
            <div>
                <div class="card">
                    <div class="card-header text-left">
                        <div>
                            {card.CardName}
                        </div>

                        <div>
                            {canBuy ?
                                <DeckFunctions cardId={card.cardId} gameCode={gameCode} player={player}/> : null}
                        </div>
                    </div>
                    <div class="cardImage">
                    <img src={punch}></img>
                    </div>
                    <div class="card-type">
                        {card.Type}
                    </div>
                    <div class="card-text">
                        {card.CardText}
                    </div>
                    <div class="card-footer">
                        <div class="float-left">
                            {card.VictoryPoints}
                        </div>
                        <div class="float-right bold">
                            {card.Cost}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Card