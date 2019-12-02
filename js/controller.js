"use strict";

const WELCOME_SCREEN = 0;
const GET_PLAYERS_SCREEN = 1;
const PLAY_GAME_SCREEN = 2;

const mainElement = document.querySelector("#main");
const addPlayerButton = document.querySelector("#addPlayerButton");
const beginGameButton = document.querySelector("#beginGameButton");

const players = [];
const avatars = ["img/avatar00.jpg", "img/avatar01.jpg", "img/avatar02.jpg", "img/avatar03.jpg"];
let currentAvatar;
// console.dir(mainElement);



const Mode = (function() {
    var mode = 0;
    // function myHelp() {
    //     return `How to Use myMath\n\nFunctions      arguments\nhelp (this function)   n/a\nadd       x, y\nsub       x,y`;
    // }
     var welcomeScreen = () =>  {mode = 0; console.log("Welcome" + mode); }
     var getPlayersScreen = () =>  {mode = 1; console.log("get players" + mode); }
     var playGameScreen = () =>  {mode = 2; console.log("play" + mode); }

    return {
        welcomeScreen: welcomeScreen,
        getPlayersScreen: getPlayersScreen,
        playGameScreen: playGameScreen
    }
}
)();

class PlayerInfo {
    constructor (name, avatar, score) {
        this.name = name;
        this.avatar = avatar;
        this.score = score;
    }
}

function saveCurrentPlayerInfo(name, avatar, totalWins) {
    // console.log(`saving current player ${players.length+1} ${name}`);
    let player = new PlayerInfo(name, avatar, totalWins);
    players.push(player);
}

// When user clicks checkmark, save current player's info
function confirmPlayer() {
    let player = document.querySelector(`#${this.parentElement.id}`);
    let name = document.querySelector(`#${player.id} .getPlayerName`).value;
    // save current player info to player array
    saveCurrentPlayerInfo(name, currentAvatar, 0);  // NOTE: now players.length IS the number of current players

    // prevent further changes to current player by rewriting the HTML
    player.innerHTML = `
        <span class="largeText">Player ${players.length}</span> <!-- players.length includes the new player now -->
        <span class="largeText havePlayerName">${name}</span>
        <img class="playerAvatar" src="${avatars[players[players.length-1].avatar]}" alt="avatar">
    `;
    // if <=5 players show new player field
    if (players.length < 5) {  // NOTE: after saveCurrentPlayerInfo, players.length IS the number of current players
        displayAnotherPlayerField();
    }
    // if >=2 players, show Play Game button
    if (players.length >=2) {
        beginGameButton.classList.remove("hidden");
    }
    
}

function prevAvatar () {
    currentAvatar--;
    if (currentAvatar < 0) {
        currentAvatar = avatars.length - 1;
    }
    document.querySelector(`#${this.parentElement.id} .playerAvatar`).src=`${avatars[currentAvatar]}`;
}

function nextAvatar () {
    currentAvatar++;
    if (currentAvatar > avatars.length - 1) {
        currentAvatar = 0;
    }
    document.querySelector(`#${this.parentElement.id} .playerAvatar`).src=`${avatars[currentAvatar]}`;
}

function displayAnotherPlayerField() {
    console.log("add player");
    currentAvatar = 0;
    let newPlayerField = document.createElement("div");
    newPlayerField.classList.add("playerSelection");
    newPlayerField.setAttribute("id", `player${players.length+1}`)
    newPlayerField.innerHTML = `
        <span class="largeText">Player ${players.length+1}</span>
        <input class="largeText getPlayerName" type="text" placeholder="Player Name">
        <img class="arrowPrev" src="img/arrow-next.png" alt="prev">
        <img class="playerAvatar" src="${avatars[currentAvatar]}" alt="avatar">
        <img class="arrowNext" src="img/arrow-next.png" alt="next">
        <img class="confirmPlayer hidden" src="img/checkmark.jpg" alt="confirm">
    `;

    // add this new person at the end of the list of players, which is just before the addPlayerButton
    addPlayerButton.parentNode.insertBefore(newPlayerField, addPlayerButton);
    // set focus in new name field 
    document.querySelector(`#player${players.length+1} .getPlayerName`).focus();

    // add relevant event listeners
    document.querySelector(`#player${players.length+1} .arrowPrev`).addEventListener("click", prevAvatar);
    document.querySelector(`#player${players.length+1} .arrowNext`).addEventListener("click", nextAvatar);

    document.querySelector(`#player${players.length+1} .getPlayerName`).addEventListener("input", displayConfirmButton);
    document.querySelector(`#player${players.length+1} .confirmPlayer`).addEventListener("click", confirmPlayer); 
}

function displayConfirmButton() {
// TO DO
// only only let 1st char of name be a valid char - use RegEx

    if (this.value.length){ 
        document.querySelector(`#${this.parentNode.id} .confirmPlayer`).classList.remove("hidden");
    } else {
        document.querySelector(`#${this.parentNode.id} .confirmPlayer`).classList.add("hidden");
    }
}

function init() {
    
    // start in welcome Screen

    // but for now, start with get players
    // console.dir("in init");

    displayAnotherPlayerField();

    addPlayerButton.addEventListener("click", displayAnotherPlayerField);
    beginGameButton.addEventListener("click", beginGame);

    //////////////////////////////////////////////
    // test the game screen by giving player info
    // let temp =[
    //     {name: "one", avatar: 0, score: 0},
    //     {name: "two", avatar: 1, score: 0},
    //     {name: "three", avatar: 0, score: 0},
    //     {name: "four", avatar: 2, score: 0},
    //     {name: "five", avatar: 3, score: 0}
    // ]
    // players.push(...temp);
    // beginGame();
    // end test the game
    //////////////////////////////////////////////


}

init();

///////////////////////////////////////////////
function login() {
    var emailDOM = document.querySelector("#email");
    var passDOM = document.querySelector("#password");

    let result = checkInfo(emailDOM.value, passDOM.value);

    if (result == "error") {
        alertForError();
    } else {
        createH1(result);
    }
}