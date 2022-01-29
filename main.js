
/* Libraries */
const axios         = require('axios');
const EventSource   = require('eventsource');

/* XOXO Professional AI */
const Constants = require('./src/Constants.js');
const EventHub = require('./src/EventHub.js');
const ZobristHash = require('./src/model/ZobristHash.js');
const TranspositionTableEntry = require('./src/model/TranspositionTableEntry.js');
const TranspositionTable = require('./src/model/TranspositionTable.js');
const Move = require('./src/model/Move.js');
const Point = require('./src/model/Point.js');
const Player = require('./src/model/Player.js');
const Board = require('./src/model/Board.js');
const GoBoard = require('./src/components/GoBoard.js');
const Stone = require('./src/components/Stone.js');
const CircleStone = require('./src/components/CircleStone.js');
const CrossStone = require('./src/components/CrossStone.js');
const View = require('./src/View.js');
const Controller = require('./src/Controller.js');
const App = require('./src/App.js');

/* Api calls */
const register      = require('./src/api/register');
const connect       = require('./src/api/connect');
const play          = require('./src/api/play');
const checkStatus   = require('./src/api/checkStatus');
const { setInterval } = require('timers');

/* Api variables */
var nickname    = 'github.com/GeorgeSikora';
var email       = 'jiri.sikora@eulerin.com';
/*
var userId      = 'dddd0802-5c2b-402d-ae2b-3652d2a6e89e'; // nickname: github.com/GeorgeSikora
var userToken   = 'e8767ed3-59bc-404a-92d9-8009f4c5c839';
*/
var userId      = 'dc6c49e3-d0bb-44c4-a240-c4cc8f8643bc'; // nickname: github.com/GeorgeSikora
var userToken   = '893fe55b-5816-4887-872d-da19477a48b0';
var gameId, gameToken;

/* INIT */
const app = new App();
app.init();

/* GAME */

async function run()
{
    if (process.env.RU)
    {
        //nickname = 'zmatecnik' + makeid(4);
        //email = makeid(2) + 'pogus@email.cz';
        nickname = 'fuserinkaa';
        email = 'jirisikoracz@seznam.cz';

        var user = await register(nickname, email);
        userId      = user.id;
        userToken   = user.token;
    }

    const game  = await connect(userToken);
    gameId      = game.id;
    gameToken   = game.token;

    app.controller.userToken = userToken;
    app.controller.gameToken = gameToken;

    console.log(`\x1b[34m\x1b[1mNickname: ${nickname}\nEmail: ${email}\x1b[0m`);
    console.log('Game started!');
    console.log('See here: https://piskvorky.jobs.cz/detail-hry/' + gameId);

    const eventSource = new EventSource('https://mercure-server.jobs.cz/.well-known/mercure?topic=' + encodeURIComponent('five-in-a-row/' + [gameId]));

    eventSource.onmessage = function(event) {
        
        const data = JSON.parse(event.data);
        console.log(data);

        const { x, y } = data.coordinates[0];

        const pos = {
            column:     x + 60/2,
            row:        y + 60/2,
        };

        const b = app.view.board;
        b.handleCellClick.call(b, pos);

        logBoard();
        console.log("xDDD! adfjoai jifsjfio siofjsio iosefisfeisoif");

        /*
        enemyPlayed(data);
        */
    }

    checkStatus(userToken, gameToken);

    console.log('Playing first round...');
    var playRes = await play(userToken, gameToken, getRandomArbitrary(-5, 5), getRandomArbitrary(-5, 5));
    console.log(`Played first round: ${playRes.played}`);
}

run();
/*
const b = app.view.board;
b.handleCellClick.call(b, {column: 6, row: 5});
b.handleCellClick.call(b, {column: 9, row: 6});
b.handleCellClick.call(b, {column: 9, row: 6});
*/
function logBoard()
{
    console.log('------------------------------------------------------------');
    for (let yy = 0; yy < app.board.points.length; yy++)
    {    
        var line = '|';
        for (let xx = 0; xx < app.board.points[yy].length; xx++)
        {
            line += app.board.points[yy][xx];
        }
        line += '|'
    
        console.log(line);
    }
}

function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}
function makeid(length)
{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ )
    {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}