var expect = chai.expect;

describe('Generic Card Tests', function() {
  it('Should not have a value', function() {
    expect(new Card()).to.not.have.property('value');
  });

  describe('Rank', function() {
    it('Should have a Rank property', function() {
      expect(new Card()).to.have.property('rank');
    });
    it('Should have Rank as a String', function() {
      expect(new Card('A').rank).to.be.a('string');
    });
    it('Should accept a Rank on construction', function() {
      expect(new Card('A').rank).to.equal('A');
      expect(new Card('K').rank).to.equal('K');
    });
  });

  describe('Suit', function() {
    it('Should have a Suit property', function() {
      expect(new Card()).to.have.property('suit');
    });
    it('Should have Suit as a String', function() {
      expect(new Card('A', 'S').suit).to.be.a('string');
    });
    it('Should accept a Suit on construction', function() {
      expect(new Card('A', 'S').suit).to.equal('S');
      expect(new Card('K', 'D').suit).to.equal('D');
    });
  });
});

describe('Value Card Tests', function() {
  it('Should have a Value property', function() {
    expect(new PokerCard()).to.have.property('value');
  });
  it('Should have Value as an Integer', function() {
    expect(new PokerCard('A', 'S').value).to.be.a('number');
  });
  it('Should derive value from Rank and/or Suit on construction', function() {
    expect(new PokerCard('A', 'S').value).to.equal(14);
    expect(new PokerCard('K', 'D').value).to.equal(13);
  });
});

describe('Deck Tests', function() {
  it('Should have a cards property', function() {
    expect(new Deck()).to.have.property('cards');
  });
  it('Should have a cards Array', function() {
    expect(Array.isArray(new Deck().cards)).to.be.true;
  });
  it('Should have 52 cards on instantiation', function() {
    expect(new Deck().cards.length).to.equal(52);
  });
  it('Should default to cards of type Card', function() {
    expect(new Deck().cards[0] instanceof Card).to.be.true;
  });
  it('Should accept a type of Card as a constructor parameter', function() {
    expect(new Deck(PokerCard).cards[0] instanceof PokerCard).to.be.true;
  });
  it('Should default to Card if invalid constructor parameter', function() {
    expect(new Deck("Card").cards[0] instanceof Card).to.be.true;
  });

  describe('Shuffle Tests', function() {
    it('Should be very likely to shuffle the cards into a different order', function() {
      let deck = new Deck();
      let shuffledAll = true;
      for (let i = 0; shuffledAll && i < 1000; i++) {
        let temp = deck.render();
        deck.shuffle();
        shuffledAll = shuffledAll && deck.render() !== temp;
      }
      expect(shuffledAll).to.be.true;
    });

    it('Should be very likely to shuffle most cards into a different place', function() {
      let deck = new Deck();
      let totalCards = 0;
      let totalUnshuffled = 0;
      for (let i = 0; i < 1000; i++) {
        let copy = JSON.parse(JSON.stringify(deck));
        deck.shuffle();
        let unshuffledCount = 0;
        for (let j = 0; j < deck.cards.length; j++) {
          if (copy.cards[j].rank === deck.cards[j].rank && copy.cards[j].suit === deck.cards[j].suit) {
            unshuffledCount++;
          }
        }
        totalCards += deck.cards.length;
        totalUnshuffled += unshuffledCount;
      }
      expect((totalUnshuffled / totalCards) < .04).to.be.true;
    });
  });

  describe('Ascending Order Sort Tests', function() {
    let genericOrder = "AS 2S 3S 4S 5S 6S 7S 8S 9S 10S JS QS KS\n" +
                       "AD 2D 3D 4D 5D 6D 7D 8D 9D 10D JD QD KD\n" +
                       "AC 2C 3C 4C 5C 6C 7C 8C 9C 10C JC QC KC\n" +
                       "AH 2H 3H 4H 5H 6H 7H 8H 9H 10H JH QH KH\n";

    it('Should order as newly opened deck of cards for generic deck (no value)', function() {
      expect(new Deck().shuffle().order().render()).to.equal(genericOrder);
    });

    it('Should order be able to order cards ascending by value + additional (suit in this case: S > H > D > C)', function() {
      let pokerDeck = new PokerDeck().order();
      let sorted = true;

      for (let i = 1; sorted && i < pokerDeck.cards.length; i++) {
        sorted = pokerDeck.cards[i].value === pokerDeck.cards[i - 1].value ?
          pokerDeck.cards[i].suit >= pokerDeck.cards[i - 1].suit :
          pokerDeck.cards[i].value >= pokerDeck.cards[i - 1].value
      }

      expect(sorted).to.be.true;
    });
  });
});
