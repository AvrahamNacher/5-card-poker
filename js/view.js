"use strict";





function displayPlayers() {

}


//////////////////////////////////////////////////////
function alertForError() {
    alert ("Wrong credentials");
}

function createH1(name) {
    let html = `<h1>Welcome ${name}</h1>`;
    document.querySelector("#main-old").innerHTML = html;
}