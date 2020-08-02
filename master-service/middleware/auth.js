const jwt = require('jsonwebtoken')
require('dotenv/config')

const ACCESS_JWT = process.env.ACCESS_JWT

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            res.status(401).json({ message: 'auth token is empty' })
        } else {
            const decoded = jwt.verify(token, ACCESS_JWT)
            req.user = decoded
            next()
        }
    } catch (e) {
        res.status(401).json({ message: 'auth token is not verified' })
    }
}
