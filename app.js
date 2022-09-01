/**
 * Author: Ryann Flores
 * Date: September 1, 2022
 * Description: An api with an endpoint /message that accepts and returns a JSON object
 */

import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * @description: Endpoint that accepts and returns a JSON object
 * @method: POST
 * @payload: { conversation_id: '',  message: ''}
 * @returns: { response_id: '',  response: ''}
 */
app.post('/message', function (req, res) {
    // only continue if the property conversation_id and message are both found
    if (req.body.hasOwnProperty("conversation_id") && req.body.hasOwnProperty("message")) {
        const conversation_id = req.body.conversation_id;
        const greet = ['Hello', 'hi'];
        const farewell = ['Goodbye', 'bye'];

        // remove special characters so that we can parse the data properly
        let incomingMessage = removeSpecialCharacters(req.body.message);

        // split the message into words to make sure that we are comparing words and not just string to avoid inaccurate response
        // Hi!, I'm John will not result to a match because of the exclamation point(!); By removing special characters we can make sure we compare only alphanumeric chracters
        // This fixes the false response of returning the value 'Welcome to StationFive' if there is a word like high, thigh, thing and so on.
        incomingMessage = removeSpecialCharacters(req.body.message).split(' ');

        // use tilde so that we don't have to escape the special character single quote;
        // initialize the variable as no context; If there is a match this variable will be set to different value
        let finalMessage = `Sorry, I don't understand.`;

        for (let i = 0; i < greet.length; i++) { // iterate over array greet
            for (let y = 0; y < incomingMessage.length; y++) { // iterate over array incomingMessage
                // We force a toLocaleLowerCase to normalize the string so we can detect Hi and hi as the same word
                finalMessage = incomingMessage[y].toLocaleLowerCase() === greet[i].toLocaleLowerCase() ? 'Welcome to StationFive.' : finalMessage;
            }
        }

        for (let i = 0; i < farewell.length; i++) { // iterate over array greet
            for (let y = 0; y < incomingMessage.length; y++) { // iterate over array incomingMessage
                // We force a toLocaleLowerCase to normalize the string so we can detect Hi and hi as the same word
                finalMessage = incomingMessage[y].toLocaleLowerCase() === farewell[i].toLocaleLowerCase() ? 'Thank you, see you around' : finalMessage;
            }
        }

        res.json({ response_id: conversation_id, response: finalMessage });
    } else {
        // return a JSON response stating that the payload is invalid.
        res.json({ response_id: null, response: 'Invalid payload' });
    }
});

/**
 * @description: Add to regex expression any characters that needs to be excluded
 * @property {string} data String data to be cleaned.
 * @returns {string} - clean version of the string
 */
function removeSpecialCharacters(data) {
    return data.replace(/[&\/\\#,+()$~%.!'":*?<>{}]/g, '');
}

// standard entry point of the API
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`);
});