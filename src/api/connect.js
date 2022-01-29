const axios = require('axios');

module.exports = function connect(userToken)
{
    return new Promise((resolve, reject) => {
        axios.post('https://piskvorky.jobs.cz/api/v1/connect', {
            'userToken': userToken,
        })
        .then(res => {
        
            console.log(`statusCode: ${res.status}`);
            console.log(`statusText: ${res.statusText}`);
            console.log('data:', res.data);
            
            const token = res.data.gameToken;
            const id = res.data.gameId;

            resolve({ token: token, id: id });
        })
        .catch(error => {
            reject(error);
        });
    });
}
