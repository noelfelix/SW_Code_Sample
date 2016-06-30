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
  constructor (cardType = Card) {
    if (cardType.prototype instanceof Card === false) {
      cardType = Card;
    }

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

    return this;
  }
}

class PokerDeck extends Deck {
  constructor () {
    super(PokerCard);
  }

  order () {
    this.cards.sort(function (card1, card2) {
      let valCheck = card1.value - card2.value;
      return valCheck === 0 ? card1.suit > card2.suit ? 1 : -1 : valCheck;
    });

    return this;
  }
}
