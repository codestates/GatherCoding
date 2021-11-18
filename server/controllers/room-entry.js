const user = require('../models/user');
const group = require('../models/group');
const { findOne } = require('../models/user');
const { isAuthorized } = require('./token');

module.exports = {
    post: async (req, res) => {
        const accessToken = req.headers.authorization.split(' ')[1];
        console.log(req.cookies, 'room-entry확인용');
        // const accessToken = req.body.accessToken;
        const roomTitle = req.body.roomTitle;

        const userEmail = isAuthorized(accessToken).email;

        const newMember = await user.findOne({
            where: {
                email: userEmail
            }
        })
        console.log('뉴멤버',newMember);
        const selectedRoom = await group.findOne({
            where: {
                title: roomTitle
            }
        })
        console.log('아자자자자차차차ㅏ',selectedRoom)
        console.log('방넘버',selectedRoom.dataValues);
        // res.json("success");
        if (!newMember) {
            res.status(403).json({ data: null, message: 'no such user in the database' });
        } else {
            if (!selectedRoom) {
                res.status(403).json({ data: null, message: 'no such room in the database' });
            } else {
                newMember.addGroup(selectedRoom)
                .then((result) => {
                    console.log('이거?',result);
                    console.log('셀렉티드룸',selectedRoom);
                    user.findAll({
                        include: {
                            model: group,
                            where: {
                                id: selectedRoom.dataValues.id
                            }
                        }
                    })
                    .then((result) => {
                        console.log('이건뭐냐',result);
                        res.status(200).json({ data: result, message: 'ok' });
                    })
                    
                })
                .catch((err) => {
                    console.log(err);
                    res.status(403).json({ data: null, message: 'fobidden'});
                })
            }
        }
    }
};
