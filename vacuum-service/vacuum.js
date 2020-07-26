const ecovacsDeebot = require('ecovacs-deebot')
  , EcoVacsAPI = ecovacsDeebot.EcoVacsAPI
  , nodeMachineId = require('node-machine-id')
  , http = require('http')
  , countries = ecovacsDeebot.countries;

let account_id = process.env.ACCOUNT_ID ? process.env.ACCOUNT_ID : "name@mail.com"
  , password = process.env.PASSWORD ? process.env.PASSWORD : "password"
  , password_hash = EcoVacsAPI.md5(password)
  , device_id = EcoVacsAPI.md5(nodeMachineId.machineIdSync())
  , country = process.env.COUNTRY ? process.env.COUNTRY : "ua"
  , continent = process.env.CONTINENT ? process.env.CONTINENT : null;

async function getVacuum() {
  const json = await httpGetJson('http://ipinfo.io/json')
  country = json['country'].toUpperCase();

  if (!countries[country]) {
    throw "Unrecognized country code";
  }
  if (!countries[country].continent) {
    throw "Continent unknown for this country code";
  }

  try {
    continent = countries[country].continent.toUpperCase();
    let api = new EcoVacsAPI(device_id, country, continent);
    await api.connect(account_id, password_hash) // Login
    console.log("Connected");
    const devices = await api.devices() // Get devices
    let vacuum = devices[0];
    let vacbot = api.getVacBot(api.uid, EcoVacsAPI.REALM, api.resource, api.user_access_token, vacuum, continent);
    vacbot.connect_and_wait_until_ready();
    return vacbot
  } catch (e) {
    console.error(e)
  }
  return null
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
          `Expected application/json but received ${contentType}`);
      }
      if (error) {
        console.error("[App]", error.message);
        res.resume();
        throw error;
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', function () {
        try {
          const json = JSON.parse(rawData);
          resolve(json);
        } catch (e) {
          console.error("[App]", e.message);
          reject(e);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      reject(e);
    });
  });
}

module.exports.getVacuum = getVacuum