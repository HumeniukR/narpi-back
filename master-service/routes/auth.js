const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// TODO transfer refresh tokens into DB
let refreshTokens = []

router.post('/token', (req, res) => {
    console.log('refreshTokens:', refreshTokens)
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_JWT, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ token: `Bearer ${accessToken}`, refreshToken:  refreshToken})
    })
})

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(8)
        const hashedPwd = await bcrypt.hash(req.body.password, salt)
        const user = new User({name: req.body.name, email: req.body.email, password: hashedPwd})
        await user.save()
        res.status(201).send()
    } catch (e) {
        console.error('Error: ', e)
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    const person = await User.findOne({email: req.body.email})
    if(person == null) {
        return res.status(400).send('Wrong email address')
    }
    try {
       if(await bcrypt.compare(req.body.password, person.password)) {
           const user = {
               email: person.email,
               userId: person._id
           }
           const accessToken = generateAccessToken(user)
           const refreshToken  = jwt.sign(user, process.env.REFRESH_JWT)
           refreshTokens.push(refreshToken)
           res.status(200).json({
               token: `Bearer ${accessToken}`,
               refreshToken: refreshToken
           })
       } else {
           res.status(401).send('Wrong password')
       }
    } catch (e) {
        console.error('Error: ', e)
        res.sendStatus(500);
    }
})


router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_JWT, { expiresIn: '60s' })
}


module.exports = router;
