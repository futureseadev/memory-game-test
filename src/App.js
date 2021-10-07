import React, { Component } from "react"
import MemoryCard from './components/MemoryCard'

const generateDeck = () => {
  var index;
  let symbols = [];
  for (index = 1; index <= 18; index++) {
    symbols.push(index);
  }
  let deck = [];
  for (index = 0; index < symbols.length * 2; index++) {
    deck.push({isFlipped: false, symbol: symbols[index % symbols.length]})
  }
  return shuffle(deck)
}

function shuffle(deck) {
  var j, x, i;
  for (i = deck.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = deck[i];
      deck[i] = deck[j];
      deck[j] = x;
  }
  return deck;
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: generateDeck(),
      pickedCards: [],
      finishedCards: [],
      finishedDeck: [],
      show: false,
      fiveSecondTimer: null,
      isStart: false,
      isGameTimer: null,
      countTimer: 0
    };
  }
  unflipCards(card1Index, card2Index) {
      let card1 = {...this.state.deck[card1Index], isFlipped: false}
      let card2 = {...this.state.deck[card2Index], isFlipped: false}
      this.state.pickedCards.concat(card1Index, card2Index);
      let newDeck = this.state.deck.map((card, index) => {
        if (card1Index === index) {
          return card1
        }
        if (card2Index === index){
        return card2
        }
        return card
      })
      this.setState({deck: newDeck})
  }

  pickCard(cardIndex) {
      if (!this.state.isStart) {
        alert("Please click the start button");
        return;
      }
      if (this.state.deck[cardIndex].isFlipped === true) {
        return;
      } 
      const cardToFlip = {...this.state.deck[cardIndex], isFlipped: true};
      let newPickedCards = this.state.pickedCards.concat(cardIndex);
      const newDeck = this.state.deck.map((card, index) => {
        if (cardIndex === index) {
          return cardToFlip
        }
        return card
      })
      if (newPickedCards.length === 1) {
        let card1Index = newPickedCards[0];
        this.state.fiveSecondTimer = setTimeout(() => {
          this.unflipCards(card1Index);
          this.setState({pickedCards: []});
        }, 5000);
      }
      if (newPickedCards.length === 2) {
        if (this.state.fiveSecondTimer) {
          clearTimeout(this.state.fiveSecondTimer);
        }
        let card1Index = newPickedCards[0];
        let card2Index = newPickedCards[1];
        if (newDeck[card1Index].symbol === newDeck[card2Index].symbol) {
          this.checkGameEnd(card1Index, card2Index)
        }
        if (newDeck[card1Index].symbol !== newDeck[card2Index].symbol) {
          setTimeout(() => {this.unflipCards(card1Index, card2Index)}, 700); 
        }
        newPickedCards = [];
      }
      return this.setState({deck: newDeck, pickedCards: newPickedCards});
  }

  checkGameEnd(card1Index, card2Index) {
    let cardFinished1 = {...this.state.deck[card1Index]}
    let cardFinished2 = {...this.state.deck[card2Index]}
    if (cardFinished1.isFlipped === true) {
      this.state.finishedCards.push(cardFinished1)
    }
    if (cardFinished2.isFlipped === true) {
      this.state.finishedCards.push(cardFinished2);
    }
    if (this.state.finishedCards.length === this.state.deck.length / 2) {
      this.handleShow()
    }      
  }
  handleClose() {
    this.setState({show: false})
  }
  handleShow() {
    this.setState({show: true})
    if (this.state.isGameTimer) {
      clearTimeout(this.state.isGameTimer);
    }
    setTimeout(() => {
      alert("Congratulation!!!");
    }, 800)
  }
  restartGame() {
    // isGameTimer
    this.setState({isStart: !this.state.isStart});
    if (!this.state.isStart) {
      this.setState({countTimer: 0});
      this.state.isGameTimer = setInterval(() => {
        this.setState({countTimer: this.state.countTimer + 1})
      }, 1000);
    } else {
      if (this.state.isGameTimer) {
        clearTimeout(this.state.isGameTimer);
      }
      let newDeck = this.state.deck.map((card, index) => {
        return {...this.state.deck[index], isFlipped: false}
      })
      this.setState({deck: newDeck})
      setTimeout(() => {
        this.setState({deck: generateDeck(), pickedCards: [], finishedCards: [], finishedDeck: [], show: false, fiveSecondTimer: null, countTimer: 0});
      }, 800);
    }
    
  }
  
  render() {
    return (
      <div className="p-10">
        <div className="">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-1" onClick={this.restartGame.bind(this)}>
            {!this.state.isStart ? "Start Game" : "Reset Game"}
          </button>
          <span className="text-xl ml-10">
            Time: {this.state.countTimer}
          </span>
        </div>
        <div className="grid grid-flow-row lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-1 mt-7">
          {this.state.deck.map( (card, index) => {
            return <MemoryCard symbol={card.symbol} isFlipped={card.isFlipped} key={index} pickCard={this.pickCard.bind(this, index)}/>
          })}
        </div>
      </div>
    )
  }
}

export default App;

