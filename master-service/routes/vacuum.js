const express = require('express');
const router = express.Router();
const axios = require('axios')
require('dotenv/config')

const URL = process.env.VACUUM_API_URL
const VACUUM_API_KEY = process.env.VACUUM_API_KEY

router.post('/', async function(req, res) {
    try {
        const vacuumRes = await axios.post(URL, {
            VACUUM_API_KEY,
            command: req.body.command
        })
        systemState.vacuum.lastCommand = req.body.command
        res.status(200).json(vacuumRes.data)
    } catch (e) {
        console.error(e)
        res.send(500);
    }
});

module.exports = router;
