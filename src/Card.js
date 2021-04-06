import React from 'react'
import DeckFunctions from './deckFunctions'
// import punch from './Cards/punch.JPG'
class Card extends React.Component {
    render() {
        var card= this.props.card;
        var gameCode = this.props.gameCode;
        var canBuy = false;
        var cardNameForUrl = card.CardName.replace(/\s/g, "").replace(',', "").toLowerCase();
        if (this.props.canBuy) {
            canBuy = true;
        }
        var player = this.props.player; 
        return (
            <div>
                <div class="card">
                    <div class="card-header text-left row">
                        <div>
                            {card.CardName}
                        </div>

                        <div class="header-button">

                        </div>
                    </div>
                    <div class="cardImage">
                    <img src={`https://firebasestorage.googleapis.com/v0/b/dc-deck.appspot.com/o/${cardNameForUrl}.JPG?alt=media`} alt=""></img>
                    </div>
                    <div class="card-type">
                        {card.Type}
                    </div>
                    <div class="card-text">
                        {card.CardText}
                    </div>
                    <div class="card-footer row">
                        <div class="float-left">
                            {card.VictoryPoints}
                        </div>
                        <div class="buy-button">
                        {canBuy ?
                                <DeckFunctions cardId={card.CardId} gameCode={gameCode} player={player}/> : null}
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
export default Card;