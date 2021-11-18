const user = require('../models/user');
const group = require('../models/group');
const token = require('./token');
const { User } = require('../models');
const db = require('../models');
const UserGroup = require('../models/user_group');
// module.exports = {
//     delete: async (req, res) => {

//         const groupList = await group.findAll({
//             include: [{
//                 model: user,
//             }]
//         });
//         if (!groupList) {
//             res.status(404).json('not found');
//         } else {
//             for (let group of groupList) {
//                 if (group.Users === undefined) {
//                     res.status(404).json('not found');
//                 }
//                 if (group.Users.length === 0) {
//                     group.destroy({
//                         truncate: true
//                     });
//                     res.status(200).json('ok');
//                 }
//                 if (group.Users.length > 0) {
//                     res.status(200).json({data: group.Users.length});
//                 }
//             }
//         }
//     }
// };


module.exports = {
    patch: async (req, res) => {
        const accessToken = req.headers.Authorization.split(' ')[1];
        const userData = token.isAuthorized(accessToken)
        const userId = userData.email;
        const roomTitle = req.body.title;
        console.log(roomTitle);
        const selectedGroup = await group.findOne({
            where: {
                title: roomTitle
            },
            include: {
                model: user,
                where: {
                    email: userId
                }
            }
        });
        console.log(selectedGroup);
        // console.log(selectedGroup.dataValues.Users);
        if (selectedGroup) {
            const selectedGroupId = selectedGroup.dataValues.id;
            const userIdToDelete = selectedGroup.dataValues.Users[0].dataValues.id;
            UserGroup.destroy({
                where: {
                    GroupId: selectedGroupId,
                    UserId: userIdToDelete
                }
            })
                .then((result) => {
                    console.log(result);
                    group.findOne({
                        where: {
                            id: selectedGroupId
                        },
                        include: {
                            model: user
                        }
                    })
                        .then((result) => {
                            console.log(result.dataValues.Users);
                            // 방에 남은 인원이 0명이면
                            if (result.dataValues.Users.length === 0) {
                                group.destroy({
                                    where: {
                                        id: selectedGroupId
                                    }
                                })
                                    .then((result) => {
                                        res.json({ data: { currentPopulation: 0 }, message: 'room deleted' });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        res.json('error3');
                                    })
                            } else {
                                // 방에 남은 인원이 0명이 아니면
                                res.json({ data: { currentPopulation: result.dataValues.Users.length }, message: 'room exit success' });
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            res.json('error4')
                        })
                })
                .catch((err) => {
                    console.log(err);
                    res.json("error1")
                })
        } else {
            res.json({ data: null, message: 'no such room in the database' });
        }
    }
};