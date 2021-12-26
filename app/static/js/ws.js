"use strict";

const log = (text) => {
    let output = `<div class="result"> <h2>Saldo em BNB:</h2> ${text}</div>`
    document.getElementById('log').innerHTML += output;
  };

const socket = new WebSocket('ws://' + location.host + '/echo');

socket.addEventListener('message', ev => {
    log(ev.data);
});
  
document.getElementById('form').onsubmit = ev => {
    ev.preventDefault();
    const textField = document.getElementById('text');
    // devolve texto enviado pelo client
    // log('>>> ' + textField.value);
    socket.send(textField.value);
    textField.value = '';
  };