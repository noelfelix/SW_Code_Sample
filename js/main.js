class Card {
  constructor (rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  render () {
    return this.rank + this.suit;
  }
}

class PokerCard extends Card {
  constructor (rank, suit) {
    super(rank, suit);
    this.value = getValue(rank);

    function getValue(rank) {
      switch (rank) {
        case "J":
          return 11;
          break;
        case "Q":
          return 12;
          break;
        case "K":
          return 13;
          break;
        case "A":
          return 14;
          break;
        default:
          return parseInt(rank);
      }
    }
  }
}

class Deck {
  constructor (cardType = Card, sortParams) {
    if (cardType.prototype instanceof Card === false) {
      cardType = Card;
    }

    this.sortParams = sortParams;

    let suits = ["S", "D", "C", "H"];
    let ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    this.cards = [];

    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        this.cards.push(new cardType(rank, suit));
      });
    });
  }

  render () {
    return this.cards.reduce(function (display, card, index) {
      if (index % 13 === 12) {
        return display + card.render() + '\n';
      }
      return display + card.render() + ' ';
    }, "");
  }

  shuffle () {
    let randInd1, randInd2, temp;

    for (let i = 0; i < this.cards.length * 2; i++) {
      randInd1 = Math.floor(Math.random() * this.cards.length);
      randInd2 = Math.floor(Math.random() * this.cards.length);
      temp = this.cards[randInd1];
      this.cards[randInd1] = this.cards[randInd2];
      this.cards[randInd2] = temp;
    }

    return this;
  }

  order () {
    if (!this.sortParams) {
      let rankValues = {
        'A' : 1, '2' : 2, '3' : 3, '4' : 4, '5' : 5, '6' : 6, '7' : 7,
        '8' : 8, '9' : 9, '10' : 10, 'J' : 11, 'Q' : 12, 'K' : 13
      };

      let suitValues = {
        'H' : 1, 'C' : 2, 'D' : 3, 'S' : 4
      };

      this.cards.sort(function (card1, card2) {
        let suitCheck = card1.suit === card2.suit ? 0 : suitValues[card1.suit] < suitValues[card2.suit] ? 1 : -1;
        return suitCheck === 0 ? rankValues[card1.rank] - rankValues[card2.rank] : suitCheck;
      });
    } else {
      let mySort = function (a, b, paramIndex) {
        if (this.sortParams[paramIndex] === undefined) return 0;
        if (a[this.sortParams[paramIndex]] === b[this.sortParams[paramIndex]]) return mySort(a, b, paramIndex + 1)
        return a[this.sortParams[paramIndex]] > b[this.sortParams[paramIndex]] ? 1 : -1;
      }.bind(this);

      this.cards.sort(function (card1, card2) {
        return mySort(card1, card2, 0);
      });
    }
    return this;
  }
}

class PokerDeck extends Deck {
  constructor () {
    super(PokerCard, ['value', 'suit']);
  }
}

let deck = new Deck();
let pokerDeck = new PokerDeck();

console.log('GENERIC DECK INIT:\n' + deck.render());
console.log('GENERIC DECK SHUFFLE:\n' + deck.shuffle().render());
console.log('GENERIC DECK ORDERED:\n' + deck.order().render());
console.log('\n');
console.log('POKER DECK INIT:\n' + pokerDeck.render());
console.log('POKER DECK SHUFFLE:\n' + pokerDeck.shuffle().render());
console.log('POKER DECK ORDERED:\n' + pokerDeck.order().render());
