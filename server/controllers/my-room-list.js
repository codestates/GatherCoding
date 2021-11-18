const user = require('../models/user');
const group = require('../models/group');
const token = require('./token');
// const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

module.exports = {
    get: (req, res) => {
        // const city = req.query.city;
        const accessToken = req.headers.authorization.split(' ')[1]
        // const accessToken = req.headers.authorization.split(' ')[1];
        // const accessToken = req.body.accessToken;
        const userId = token.isAuthorized(accessToken).email || token.isAuthorized(accessToken).username;
        console.log('뙜나??',req.cookies)
        // const { Op } = require("sequelize");
        // Post.findAll({
        //     where: {
        //         [Op.or]: [
        //             { authorId: 12 },
        //             { authorId: 13 }
        //         ]
        //     }
        // });
        // SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
        group.findAll({
            include: [{
                model: user,
                where: {
                    [Op.or]: [
                        { email: userId },
                        { username: userId }
                    ]  
                }
            }]
        })
            .then((result) => {
                if (result.length === 0) {
                    console.log(result);
                    res.status(200).json({ data: null, message: 'this user has not joined any room yet' });
                } else {
                    console.log(result);
                    res.status(200).json({ data: result, message: 'ok' });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(404).json({ data: null, message: 'page not found' });
            })
    },
};