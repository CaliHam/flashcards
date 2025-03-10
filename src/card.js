const createCard = (id, question, answers, correctAnswer) => {
    var card = {
        id: id,
        question: question,
        answers: answers,
        correctAnswer: correctAnswer,
    }
    return card
}

const evaluateGuess = (guess, card) => {
    if (guess === card.correctAnswer) {
        return 'correct!'
    } else {
        return 'incorrect!'
    }
}

module.exports = { 
    createCard,
    evaluateGuess,
};