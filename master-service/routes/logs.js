const express = require('express');
const router = express.Router();
const Log = require('../models/Log')

router.get('/', async (req, res) => {
    const logs = await Log.find({})
    //res.redirect('/login');
    res.send(logs);
});

router.post('/', async (req, res) => {

    const log = new Log({
        entity: req.body.entity,
        action: req.body.action,
        value: req.body.value || null,
        dateTime: req.body.dateTime || new Date().toLocaleString()
    })

    await log.save()
    res.sendStatus(200);
});


module.exports = router;
