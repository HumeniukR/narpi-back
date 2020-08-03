const express = require('express');
const router = express.Router();
const axios = require('axios')
require('dotenv/config')

router.get('/', async (req, res) => {
    const logs = await Log.find({})
    res.send(logs);
});

const URL = process.env.CONTROLLER_API_URL
const API_KEY = process.env.CONTROLLER_API_KEY

router.post('/light', async function(req, res) {
    try {
        const controllerRes = await axios.post(URL + 'command', {
            API_KEY,
            command: {
                name: req.body.command.enable ? 'ledOn' : 'ledOff',
                ledNumber: req.body.command.ledNumber
            }
        })
        res.status(200).json(controllerRes.data)
    } catch (e) {
        console.error(e)
        res.send(500);
    }
});

router.post('/window', async (req, res) => {
    try {
        const controllerRes = await axios.post(URL + 'command', {
            headers: {
                'Content-Type': 'application/json'
            },
            API_KEY,
            command: {
                name:'windowSet',
                percent: req.body.command.percent
            }
        })

        res.status(200).json(controllerRes.data)
    } catch (e) {
        console.error(e)
        res.send(500);
    }

});

router.post('/alarm', async (req, res) => {
    try {
        const controllerRes = await axios.post(URL + 'command', {
            API_KEY,
            command: {
                name: req.body.armed ? 'enableAlarm' : 'disableAlarm',
            }
        })
        res.status(200).json(controllerRes.data)
    } catch (e) {
        console.error(e)
        res.send(500);
    }
});

router.get('/alarm', async (req, res) => {
    try {
        const controllerRes = await axios.post(URL + 'alarm', {
            API_KEY
        })
        res.status(200).json(controllerRes.data)
    } catch (e) {
        console.error(e)
        res.send(500);
    }
});

module.exports = router;
