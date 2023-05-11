const chai = require('chai');
const expect = chai.expect;

const { createCard } = require('../src/card');
const { createDeck } = require('../src/deck');
const { createRound, takeTurn, calculatePercentCorrect, endRound, stopTimer } = require('../src/round');


describe('round', function() {
    it('should return a round', function() {
        const card1 = createCard(1, 'What allows you to define a set of related information using key-value pairs?', ['object', 'array', 'function'], 'object');
        const card2 = createCard(2, 'What is a comma-separated list of related values?', ['object', 'array', 'function'], 'array');
        const card3 = createCard(3, 'What is an example of a mutator method?', ['sort()', 'map()', 'join()'], 'sort()')

        const deck = createDeck([card1, card2, card3]);
        const round = createRound(deck)

        expect(round.deck).to.equal(deck)
        expect(round.currentCard).to.equal(card1)
        expect(round.turns).to.equal(0)
        expect(round.incorrectGuesses).to.deep.equal([])
    })
})

describe('take turn', function() {
    let card1, card2, card3, deck, round;
    beforeEach(() => {
        card1 = createCard(1, 'What allows you to define a set of related information using key-value pairs?', ['object', 'array', 'function'], 'object');
        card2 = createCard(2, 'What is a comma-separated list of related values?', ['object', 'array', 'function'], 'array');
        card3 = createCard(3, 'What is an example of a mutator method?', ['sort()', 'map()', 'join()'], 'sort()')
        deck = createDeck([card1, card2, card3]); 
        round = createRound(deck)  
    })
    it('should allow user to take a turn', function() {
        const guess1 = takeTurn('object', round, deck)

        expect(guess1).to.equal('correct!')
        expect(round.currentCard).to.equal(card2)
        expect(round.turns).to.equal(1)
    })
    it('should update incorrect guesses if the guess is wrong', function() {
        const guess1 = takeTurn('array', round, deck)

        expect(guess1).to.equal('incorrect!')
        expect(round.currentCard).to.equal(card2)
        expect(round.turns).to.equal(1)
        expect(round.incorrectGuesses).to.deep.equal([1])
    })
    it('should update when many turns are taken', function() {
        const guess1 = takeTurn('array', round, deck)

        expect(guess1).to.equal('incorrect!')
        expect(round.currentCard).to.equal(card2)
        expect(round.turns).to.equal(1)
        expect(round.incorrectGuesses).to.deep.equal([1])

        const guess2 = takeTurn('array', round, deck)

        expect(guess2).to.equal('correct!')
        expect(round.currentCard).to.equal(card3)
        expect(round.turns).to.equal(2)
        expect(round.incorrectGuesses).to.deep.equal([1])
    })
})

describe('calculate percentage correct', function() {
    it('should calculate and return the percentage of correct guesses', function() {
        const card1 = createCard(1, 'What allows you to define a set of related information using key-value pairs?', ['object', 'array', 'function'], 'object');
        const card2 = createCard(2, 'What is a comma-separated list of related values?', ['object', 'array', 'function'], 'array');
        const card3 = createCard(3, 'What is an example of a mutator method?', ['sort()', 'map()', 'join()'], 'sort()')
        const deck = createDeck([card1, card2, card3]);
        const round = createRound(deck)
        const guess1 = takeTurn('array', round, deck)
        const guess2 = takeTurn('array', round, deck)
        const right = calculatePercentCorrect(round, deck)

        expect(guess1).to.equal('incorrect!')
        expect(round.incorrectGuesses).to.deep.equal([1])
        expect(guess2).to.equal('correct!')
        expect(round.incorrectGuesses).to.deep.equal([1])
        expect(right).to.equal(50)
    })
})

describe('end round', function() {
    let card1, card2, card3, deck, round;
    beforeEach(() => {
        card1 = createCard(1, 'What allows you to define a set of related information using key-value pairs?', ['object', 'array', 'function'], 'object');
        card2 = createCard(2, 'What is a comma-separated list of related values?', ['object', 'array', 'function'], 'array');
        card3 = createCard(3, 'What is an example of a mutator method?', ['sort()', 'map()', 'join()'], 'sort()')
        deck = createDeck([card1, card2, card3]);
        round = createRound(deck)
    })
    it('should end the round if you run out of cards', function() {
        const guess1 = takeTurn('array', round, deck)
        const guess2 = takeTurn('array', round, deck)
        const guess3 = takeTurn('sort()', round, deck)
        const end = endRound(round)

        expect(guess1).to.equal('incorrect!')
        expect(round.incorrectGuesses).to.deep.equal([1])
        expect(guess2).to.equal('correct!')
        expect(round.incorrectGuesses).to.deep.equal([1])
        expect(guess3).to.equal('correct!')
        expect(round.incorrectGuesses).to.deep.equal([1])
        expect(end).to.equal('** Round over! ** You answered 66% of the questions correctly!')
    })
    it('should show the time it took to complete the quiz in minutes and/or seconds', function(done) {
        let endTime;

        setTimeout(() => {
           endTime = stopTimer(round)
           expect(endTime).to.equal(`You completed the quiz in 1 seconds.`)
           done()
        }, 1000)
    })
})