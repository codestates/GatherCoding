const user = require('../models/user');
const group = require('../models/group');

module.exports = {
    post: (req, res) => {
        res.send("Hello World");
    },
    get: async (req, res) => {
        // console.log('씨티',req.query.city)
        // console.log('도',req.query.region)
        const region = req.query.region;
        const city = req.query.city;
        if (!region || !city) {
            res.status(400).json({ data: null, message: 'you should enter all the required information' });
        } else {
            // const jane = await user.create({
            //     username: 'Jane',
            //     email: 'yy1234@baver.com',
            //     password: '4567',
            //     image: '/download/image.png',
            //     blog: 'github.com/yy',
            //     current_location: '충북 청주'
            // });
            // const paul= await user.create({
            //     username: 'Paul',
            //     email: 'asdfg@naver.com',
            //     password: '9087',
            //     image: '/home/image.png',
            //     blog: 'github.com/paul',
            //     current_location: 'Seoul Mapo'
            // });
            // const mogako = await group.create({
            //     title: 'mogako',
            //     description: '마포구 사는 개발자 모임',
            //     population: 10,
            //     meeting_place: '스타벅스',
            //     leader_id: 1,
            //     region: 'Seoul',
            //     city: 'Mapo'
            // });
            // await paul.addGroup(mogako)
            //     .then((result) => {
            //         console.log('success');
            //     })
            // const jane_group = Group.findAll({
            //     include: [{
            //         model: User,
            //         where: {
            //             username: 'Jane'
            //         }
            //     }],
            // })
            //     .then((result) => {
            //         console.log(result);
            //         res.send(result);
            //     })
            // const jane = user.create({})
            const myRoom = await group.findAll({
                where: {
                    region: region,
                    city: city
                },
                include: [{
                    model: user,
                }]
            })
            
                .then((result) => {
                    if (result.length === 0) {
                        res.status(200).json({ data: null, message: 'no room in this location' })
                    } else {
                        // console.log(result.length)
                        res.status(200).json({ data: result, message: 'ok' });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(404).json({ data: null, message: 'error' });
                })
        }


    }
};