const express = require('express');
const router = express.Router();
const axios = require('axios')
require('dotenv/config')

const URL = process.env.PLAYER_API_URL
const PLAYER_API_KEY = process.env.PLAYER_API_KEY

router.post('/', async function(req, res) {
    try {
        const playerRes = await axios.post(URL + req.body.command, {
            PLAYER_API_KEY,
            trackId: req.body.trackId ? req.body.trackId : null
        })
        systemState.player.pause = req.body.command === 'pause'
        res.status(200).json(playerRes.data)
    } catch (e) {
        console.error(e)
        res.send(500);
    }
});

router.get('/playlist', async function(req, res) {
    try {
        const playerRes = await axios.get(URL + 'playlist', {
            headers: {
                'player-api-key': PLAYER_API_KEY
            }
        })
        res.status(200).json(playerRes.data)
    } catch (e) {
        console.error(e)
        res.send(500);
    }
});


module.exports = router;
