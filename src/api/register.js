const axios = require('axios');

module.exports = function register(nickname, email)
{
    return new Promise((resolve, reject) => {
        axios.post('https://piskvorky.jobs.cz/api/v1/user', {
            'nickname': nickname,
            'email': email
        })
        .then(res => {
        
            console.log(`statusCode: ${res.status}`);
            console.log(`statusText: ${res.statusText}`);
            console.log('data:', res.data);
            
            const id = res.data.userId;
            const token = res.data.userToken;

            resolve({ id: id, token: token });
        })
        .catch(error => {

            reject(error);
            
            if (!error) return;
            if (!error.response) return;
            if (!error.response.data) return;
            if (!error.response.data.statusCode) return;
            
            console.error('Error: ' + error.response.data.statusCode);
            
            switch (error.response.data.statusCode) {
                case 400:
                    console.log('Uživatel již existuje!');
                    break;
            
                default:
                    break;
            }
        });
    });
}
