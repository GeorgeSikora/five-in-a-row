const axios = require('axios');

module.exports = function play(userToken, gameToken, positionX, positionY)
{
    return new Promise((resolve, reject) => {
        axios.post('https://piskvorky.jobs.cz/api/v1/play', {
            'userToken': userToken,
            'gameToken': gameToken,
            'positionX': positionX,
            'positionY': positionY
        })
        .then(res => {
        
            console.log(`statusCode: ${res.status}`);
            console.log(`statusText: ${res.statusText}`);
            console.log('data:', res.data);

            resolve({ played: true });
        })
        .catch(error => {

            //reject(error);

            if (!error) return;
            if (!error.response) return;
            if (!error.response.data) return;
            if (!error.response.data.statusCode) return;
        
            var statusCode = error.response.data.statusCode;

            switch (statusCode) {
                case 406:
                    console.log('Na řadě je druhý hráč!');
                    break;
            
                default:
                    console.log('Vyskytl se problém ' + statusCode);
                    break;
            }
        });
    });
}
