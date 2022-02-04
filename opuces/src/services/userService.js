import axios from 'axios';
import storage from '../plugins/storage.js';
import env from "../../env";


const userService = {

    jwtBaseURI: env.jwtBaseURI,
    baseURI: env.baseURI,
    opucesBaseURI: env.opucesApi,


    login: async function(login, password){
        let response = await axios.post(
            userService.jwtBaseURI+'/token',
            {
                username: login,
                password: password
            }
            
        ).catch( 
            // gestion des erreurs
            // si j'ai une erreur je vais atterir dans le .catch
            function(){
                console.log('on a une erreur');
                return false;
            }
        )
        return response.data;
    },
    checkUser: async function(token){
        let response = await axios.post(
            userService.jwtBaseURI+'/token/validate',
            { token: token
            }
        ).catch(
            function(){
                console.log('User différent');
                return false;
            }
        )
        return {
            'success': true,
            'response': response,

        };
    },

    userConnected: async function(){
        const userData = storage.get('userData');
        if(userData != null){
            const token = userData.token;
            if(token){
                const options = { headers:{Authorization: 'Bearer' . token }};
                const response = await axios.post(userService.jwtBaseURI + '/token/validate',
                null,
                options).catch(function(){ return false; });
                return response.data;
            }
        }
        return false;
    },

    inscription: async function(username, email, password, passwordVerify)
    {
        const response = await axios.post(userService.opucesBaseURI + '/create-user',
          {
              userName: username,
              email: email,
              password: password,
              confirmPassword: passwordVerify
          }  
        ).catch(function(){
            return false;
        });
        return response.data;
    },

    logout: async function ()
    {
        //on supprime dans local storage
        storage.unset('userData');
    },

    lostPassword: async function()
    {
       const response = await axios.post(userService.baseURI + '/lost-password');
       return response.data; 
    },

    updateUser: async function()
    {
        const response = await axios.patch(userService.baseURI + '/' );
        return response.data;
    },

    saveUserInformation: async function (UserId, adress, adress2, country, phoneNumber, zipcode, city)
    {
        const response = await axios.post(userService.opucesBaseURI + '/user-table',
        {
            userID: UserId,
            adress1: adress,
            adress2: adress2,
            zipcode: zipcode,
            city: city,
            country: country,
            phone_number: phoneNumber
        }
        ).catch(function(){
            console.log('saveUserInfo Error');
            return false;
        });
        return response.data;
    },

};
export default userService;