"use strict";

// uses player array for names, avatars, total wins
const MASTER_PLAYER_LOCATIONS = [
    [  [50,70],[350,70],[650,70],[950,70],[1250,70]  ], // when odd # of players
    [  [200,70],[500,70],[800,70],[1100,70]     ]  // when even # of players
];
let playerLocations = [];
const deckOfCards = ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12', 'c13',
                   's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10', 's11', 's12', 's13',
                   'h01', 'h02', 'h03', 'h04', 'h05', 'h06', 'h07', 'h08', 'h09', 'h10', 'h11', 'h12', 'h13',
                   'd01', 'd02', 'd03', 'd04', 'd05', 'd06', 'd07', 'd08', 'd09', 'd10', 'd11', 'd12', 'd13'];
let mixedDeck;
let winner;
let  proceed = false;                 

let playGameElement;
let tableElement;
let winnerTextElement;
let playAgainButtonElement;


function placePlayers() {
    let increment;
    playerLocations = [];

    // calculate location of each player
    if (players.length%2 == 1) {
        if (players.length == 5) {
            increment = 1;
        } else {  // length == 3
            increment = 2;
        }
        for (let i=0; i<5; i+=increment) {
            playerLocations.push(MASTER_PLAYER_LOCATIONS[0][i]);
        }

    } else { // even players

        if (players.length == 4) {
            for (let i=0; i<4; i++) {
                playerLocations.push(MASTER_PLAYER_LOCATIONS[1][i]);
            }
        } else { // length = 2
            for (let i=1; i<3; i++) {
                    playerLocations.push(MASTER_PLAYER_LOCATIONS[1][i]);
                }
        }
    }


    console.log(playerLocations);
    playerLocations.forEach(function(location, i) {

        let newPlayerElement = document.createElement("div");
        newPlayerElement.classList.add("playerAtTable");
        newPlayerElement.setAttribute("id", `player${i+1}`);
        newPlayerElement.style.top = playerLocations[i][1] + "px";
        newPlayerElement.style.left = playerLocations[i][0] + "px";
        newPlayerElement.innerHTML = `
            <span class="playerText">${players[i].name}</span>
            <div class="playerText">
                <span>WINS</span>
                <span class="playerWins">${players[i].score}</span>
            </div>
            <img src="${avatars[players[i].avatar]}" alt="player">
        `;
        table.appendChild(newPlayerElement);
    });

}

function dealCards() {
    // deal 5 cards to each player
    for (let i=0; i<5; i++) {

        setTimeout(function() {
            players.forEach(function(player,j) {
                
                // put card by dealer and then move it to player
                let cardElement = document.createElement("img");
                cardElement.classList.add("card");
                cardElement.classList.add(`player${j+1}`);
                cardElement.src = "img/card-back.png";
                tableElement.appendChild(cardElement);
                setTimeout(function() {
                    cardElement.style.top = playerLocations[j][1] + 180 + "px";  // playerY(70px) + 180px;
                    cardElement.style.left = (playerLocations[j][0] - 30) + (25*i) + "px"; //cards start at playerX(50px)-30px, each card is 25px from previous
                }, 1000+(j*100));  // 1000+ vs 100+
            })
        }, 1000*i); // 1000* vs 100*
        
    }
}

// thanks https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function randomizeCards(array) {
    
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function revealCards() {
    let cardNumber = 0; // 0-4 = player 1, 5-9 = player 2, etc.
    // reveal each player in order
    for (let i=0; i<5; i++) {
        setTimeout(function() {
            // console.log("reveal");
            let cards = document.querySelectorAll(`img.player${i+1}`);
            cards.forEach(function(card) {
                card.src=`img/${mixedDeck[cardNumber]}.png`;
                cardNumber++;
            })
        }, 700*i);
    }
    setTimeout(function() {
        proceed = true;
    }, 800 * players.length)
    
}

// check that all array elements are sequential
function diffByOne(arr) {
    // let sequential = true;
    for(let i=0; i<4; i++) {
        if (arr[i]-arr[i+1] != 1) {
            // sequential = false;
            return false;
        }
    }
    return true;
}

function calculateWinner() {
    console.log("calculate");
    // let suits = ['c', 's', 'h', 'd'];
    // score each players hand: 
    // thank you https://stackoverflow.com/questions/18163234/declare-an-empty-two-dimensional-array-in-javascript
    let scores = [...Array(10)].map(x=>Array(5).fill(0));
    
    // all hands are saved as 1=true, 0=false except for highCard which is a string of all the cards in the players hand
    // sorted from high to low. Any ties in a hand are resolved by who has the better 'highCard'
    let royalFlush = 0;
    
    let straightFlush = 1;  
    
    let fourOfAKind = 2; 
    
    let fullHouse = 3;
    
    let flush = 4;
    
    let straight = 5;
    
    let threeOfAKind = 6;
    
    let twoPair = 7;
    
    let onePair = 8;
    
    let highCard = 9;

    for (let player=0; player<players.length; player++) {
        // 'deal' each player 5 cards from the mixedDeck array
        let hand = mixedDeck.slice(5*player, 5*player+5);

        let suitCounts = {};
        let numCounts = {};
        let numsInHandAceLow = [];
        let numsInHandAceLowSorted = [];
        let numsInHandAceHigh = [];
        let numsInHandAceHighSorted = [];
        
        // Thanks https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
        hand.forEach(function(card) {
            let cardSuit = card.slice(0,1); // 1st char is suit, e.g d = diamond
            suitCounts[cardSuit] = (suitCounts[cardSuit] || 0) + 1; // create/add to the object using dynamic keys for each instance of a suit

            let cardNum = card.slice(1);  // 2nd,3rd chars are card value, eg. "08"
            numsInHandAceLow.push(cardNum);

            if (cardNum == "01") { 
                cardNum = "14"; 
            }
            numsInHandAceHigh.push(cardNum);

            numCounts[cardNum] = (numCounts[cardNum] || 0) + 1;  // create/add to the object using dynamic keys for each instance of a number
        })

        numsInHandAceLowSorted = [...numsInHandAceLow];        
        numsInHandAceLowSorted.sort(function(a,b){return a-b}).reverse();

        numsInHandAceHighSorted = [...numsInHandAceHigh];        
        numsInHandAceHighSorted.sort(function(a,b){return a-b}).reverse();

        // high card - save all the cards in decreasing order - determines who wins if tie
        scores[highCard][player] = numsInHandAceHighSorted.join("");

        // check if all cards are the same suit
        if (Object.keys(suitCounts).length == 1) {
            // check each suit for Royal Flush
            // if cards are sequential and Ace is the high card
            if (diffByOne(numsInHandAceHighSorted) && numsInHandAceHighSorted.slice(0,1) == "14") {
                scores[royalFlush][player] = 1;
                break;  // best hand for this player

                // else check for straight flush where Ace is the low card
            } else if (diffByOne(numsInHandAceLowSorted)) {
                scores[straightFlush][player] = 1;
                break; // best hand for this player

                // else, player has a flush
            } else {
                scores[flush][player] = 1;
            }
        }

        // check if player has a straight
        if (numsInHandAceHighSorted[0] - numsInHandAceHighSorted[4] == 4 || numsInHandAceLowSorted[0] - numsInHandAceLowSorted[4] == 4) {
            scores[straight][player] = 1;
        }

        for (let key in numCounts)  {
            if (numCounts[key] == 4) {
                scores[fourOfAKind][player] = 1;
                break; // best hand for this player
            }
            if (numCounts[key] == 3) {
                scores[threeOfAKind][player] = 1;
            }
            if (numCounts[key] == 2) {
                if (scores[onePair][player] == 0) {
                    scores[onePair][player] = 1; 
                } else {
                    scores[twoPair][player] = 1;
                }
            }
        }

        // check for Full House
        if (scores[threeOfAKind][player] && scores[onePair][player]) {
            scores[fullHouse][player] = 1;
        }       

    }

    console.log(`royal flush = ${scores[royalFlush]}  straight flush = ${scores[straightFlush]} |  4 of a kind = ${scores[fourOfAKind]}
    full house = ${scores[fullHouse]} flush = ${scores[flush]} straight = ${scores[straight]} | 3 of a kind = ${scores[threeOfAKind]}
    two pair = ${scores[twoPair]} one pair = ${scores[onePair]}`);

    // // Now compare player's hands against each other
    let pokerHandRanking=0;
    let foundHighestRank = false;
    let playersWithHand = [];
    // search each poker hand ranking starting from royal flush (0) and ending at high card (9)
    while (!foundHighestRank && pokerHandRanking<10) {
        for (let player=0; player<5; player++) {
            if (scores[pokerHandRanking][player]) {
                playersWithHand.push(player);
                foundHighestRank = true;
            }
        }
        pokerHandRanking++;
    }
    
    let bestHand = [];

    // find hands with that rank
    playersWithHand.forEach(function(player) {
        bestHand.push(scores[highCard][player]);
    })
    bestHand.sort().reverse();  // highest hand is in position 0
    let winner = scores[highCard].indexOf(bestHand[0]);

    return winner;

}

function displayWinner(winner) {
    winnerTextElement = document.createElement("div");
    winnerTextElement.setAttribute("id", "winnerText");
    winnerTextElement.innerHTML = `${players[winner].name} is the winner of this round!`
    tableElement.appendChild(winnerTextElement);

    players[winner].score++;
    document.querySelector(`#player${winner+1} .playerWins`).innerHTML = players[winner].score;


    playAgainButtonElement = document.createElement("input");
    playAgainButtonElement.value = "Deal Again";
    playAgainButtonElement.setAttribute("id", "playAgainButton");
    playAgainButtonElement.addEventListener("click", beginGame);
    tableElement.appendChild(playAgainButtonElement);
}

function beginGame() {
    mainElement.innerHTML=`<div id="playGame"><div id="table"></div></div>`
    playGameElement = document.querySelector("#playGame");
    tableElement = document.querySelector("#table");

    placePlayers();
    dealCards();
    mixedDeck = randomizeCards(deckOfCards);

    // // for testing
    // mixedDeck[5] = "d07";
    // mixedDeck[6] = "h07";
    // mixedDeck[7] = "c02";
    // mixedDeck[8] = "d02";
    // mixedDeck[9] = "s07";

    // mixedDeck[10] = "c10";
    // mixedDeck[11] = "c06";
    // mixedDeck[12] = "c09";
    // mixedDeck[13] = "c13";
    // mixedDeck[14] = "c12";

    // wait to reveal the cards
    setTimeout(function() {
        revealCards();
    }, 6500);  //6500 vs 500

    proceed = false;
    let interval = setInterval(function() {
        if (proceed) {
            winner = calculateWinner();
            displayWinner(winner);
            clearInterval(interval);
        }
    }, 500);



   
}