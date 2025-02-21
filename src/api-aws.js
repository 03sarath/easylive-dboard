import { Auth } from 'aws-amplify';
// import { EventBus } from 'src/event-bus.js'
import API from './api-config.json'
var axios = require('axios');
//var data = JSON.stringify({ "mode": "list_dep" });


export default async function(data) {
    if (data == "") {
        return;
    }

    const allData = await Auth.currentAuthenticatedUser();
    data["authUser"] = allData["attributes"]["email"];
    data["username_cognito"] = allData["username"];
    // data["trigger"] = "API" 
    console.log(data)


    var data_paylaod = JSON.stringify(data)


    // EventBus.$emit('userInfo-data', allData)


    var config = {
        method: 'post',
        url: API.api_aws,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + allData.signInUserSession.idToken.jwtToken,
        },
        data: data_paylaod
    };

    const awsData = await axios(config)
    return awsData;

}