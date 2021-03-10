const axios = require('axios');
const constants = require('../constants');
const utils = require('../utils');

const TOKEN = utils.common.checkEnvVar(constants.TOKEN);
const API_ENDPOINT = constants.API_ENDPOINT;

/**
 * Open a modal to a given user
 * @param {Object} payload - object with required request body params
 * @param {string} payload.trigger_id - The trigger ID received from a slash command (req)
 * @param {Object} payload.view - The contents of the modal using the blocks API (req)
 * @returns {Object} data
*/
async function openModal(payload) {
  const data = await doPost(`${API_ENDPOINT}/views.open`, payload);
  return data;
}

/** 
 * Send an ephemeral post to Slack
 * @param {Object} payload - object with required request body params
 * @param {string} payload.text - Contents of message to be sent (req)
 * @param {string} payload.user - ID of user to sent message to (req)
 * @param {Array}  payload.attachments - post attachments (req)
 * @param {string} payload.channel - ID of channel to post to (req)
 * @returns {Object} data
*/
async function sendEphemeralPostToUser(payload) {
  const data = await doPost(`${API_ENDPOINT}/chat.postEphemeral`, payload);
  return data;
}

/** Send a post to Slack
 * @param {Object} payload - object with required request body params
 * @param {string} payload.text - Contents of message to be sent (req)
 * @param {Array}  payload.attachments - post attachments (optional)
 * @param {string} payload.channel - ID of channel to post to (req)
 * @returns {Object} data
*/
async function sendPostToChannel(payload) {
  const data = await doPost(`${API_ENDPOINT}/chat.postMessage`, payload);
  return data;
}

async function doPost(url, data) {
  const options = {
    url,
    data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': `Bearer ${TOKEN}`,
    },
    json: true,
  };

  return await axios(options)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    utils.common.logger.error(error);
    return error;
  });
}

module.exports = {
  openModal,
  sendEphemeralPostToUser,
  sendPostToChannel,
};
