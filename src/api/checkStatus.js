const axios = require('axios');

module.exports = function checkStatus(userToken, gameToken)
{
    return new Promise((resolve, reject) => {
        axios.post('https://piskvorky.jobs.cz/api/v1/checkStatus', {
            'userToken': userToken,
            'gameToken': gameToken,
        })
        .then(res => {
        
            console.log(`statusCode: ${res.status}`);
            console.log(`statusText: ${res.statusText}`);
            console.log('data:', res.data);
            
            resolve("lol");
        })
        .catch(error => {
            reject(error);
        });
    });
}
