'use strict';

const gameSelect = document.getElementById('questionsSelection');
const gameStartForm = document.getElementById('gameStartForm');
const playerOneIconSelector = document.getElementById('playerOneIcon');
const playerTwoIconX = document.getElementById('playerTwoIconX');
const playerTwoIconO = document.getElementById('playerTwoIconO');
var newGame;


var populateQuizzes = function(){
    if(localStorage['quizBank']) {
        let quizzes = JSON.parse(localStorage['quizBank']);
        for(var key in quizzes) {
            const newEle = document.createElement('option');
            newEle.textContent = key;
            gameSelect.appendChild(newEle);
        }
    }
};

var handleGameStartForm = function(event){
    // game info
    const p1 = event.target.playerOne.value.toLowerCase();
    const p2 = event.target.playerTwo.value.toLowerCase();
    const selectedQuiz = gameSelect.options[gameSelect.selectedIndex].text;
    let player1 = {};
    let player2 = {};


    if (localStorage['playerBank']) { // check to see if players already exist
        const players = JSON.parse(localStorage['playerBank']);
        players.forEach((play) => {
            const name = play.userName.toLowerCase();
            if(name === p1){
                player1 = play;
            } else if (name === p2){
                player2 = play;
            }
        });
        if(!Object.keys(player1).length){ // create them if they arent in the playerBank
            //create players
            player1 = new Player(p1); // eslint-disable-line
        }
        if(!Object.keys(player2).length) {
            player2 = new Player(p2); // eslint-disable-line
        }

    } else { // no local storage
        //create players
        player1 = new Player(p1); // eslint-disable-line
        player2 = new Player(p2); // eslint-disable-line
    }
    // create new game from inputs
    createGame(selectedQuiz, player1, player2);
    // start game
    // newGame.playGame();

};

/** Retrieved from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples
 * Used because the game object was a circular structure
 */
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

function createGame(quiz, play1, play2){
    event.preventDefault();
    // create new game from inputs
    newGame = new Game(quiz, play1, play2); // eslint-disable-line
    var games = JSON.parse(localStorage['games']);
    games.push(newGame);
    var gamesToBeSaved = JSON.stringify(games, getCircularReplacer());
    localStorage['games'] = gamesToBeSaved;
    // start game
    newGame.playGame();
    var origin = window.location.origin;
    window.location.assign(`${origin}/play.html?`);
}

var handleIconSelection = function(event){ // controls icon selection, so users cannot be the same icon
    const icon = event.target.value;
    if(icon === 'O'){
        playerTwoIconX.disabled = false;
        playerTwoIconX.checked = true;
        playerTwoIconO.disabled = true;
    } else {
        playerTwoIconO.disabled = false;
        playerTwoIconO.checked = true;
        playerTwoIconX.disabled = true;
    }
};

if(gameSelect){
    populateQuizzes();
    // event listener for game start form
    playerOneIconSelector.addEventListener('click', handleIconSelection);
    gameStartForm.addEventListener('submit', handleGameStartForm);
}






