const user = require('../models/user');
const group = require('../models/group');
const token = require('./token/index');

// 새로운 방을 db에 넣을 때 이미 db에 있는 방과 중복 확인 부탁드립니다.
// 그러지 않으면 서버 켤 때마다 똑같은 레코드가 다시 추가되는 것 같습니다.
module.exports = {
    get : async (req, res) => {
        if(req.params) console.log(req.params)
        // console.log('header',req.headers)
        // console.log(req.headers.authorization)
        // ! 우선 토큰안해봄 하지만 나중에 고치러 와야함 
        // const tokenData = token.isAuthorized(req.headers.authorization.split(' ')[1]);
        // const tokenData = req.cookies.accessToken;
        // console.log('토큰',tokenData)
        // const { email } = token.isAuthorized(tokenData);
        // console.log('이메일',email)
        // console.log('액새스토큰복호화',accessTokenData)

        
        const newRoom = await group.findOne({
            where : { id :  req.params.id }
        })
        
        const {id,title,description,population,region,city,UserId,leader_id,meeting_time,meeting_place}=newRoom
        // if(!accessTokenData){res.status(401).json({message:'unauthorized'})}
        // console.log(newRoom)
        // else{
           return res.status(201).json({data : newRoom, message : "new room's created" })
        // }
    //     // const { title, description, population, meetingPlace, UserId, region, city } = req.body;//leaderId 시퀄라이즈에 없다.
        
    //     // const newRoom = await group.findOrCreate({
    //     //     where : {title : req.body.title},
    //     //     defaults : {
    //     //         title,
    //     //         description,
    //     //         population,
    //     //         meetingPlace,
    //     //         UserId,
    //     //         region,
    //     //         city
    //     //     }}).then(([room,created])=>{
    //     //         console.log('도착')
    //     //         if(created){
                    
    //     //             const {title,description,population,meetingPlace,UserId,region,city} = room
    //     //             const data = {title,description,population,meetingPlace,UserId,region,city}
    //     //             res.status(201).json({ data , message : "new room's created" })
    //     //         }else{
    //     //             res.status(404).json({message : " Not found "})
    //     //         }
    //     //     })
        
    },

    
    post: async (req, res) => {
        console.log(req.headers.authorization.split(' ')[1])

        // console.log('리코그바디',req.body)


        const accessTokenData = token.isAuthorized(req.headers.authorization.split(' ')[1]);
        const { title, description, population, meeting_place, meeting_time, leader_id, UserId, region, city } = req.body;
        // if (!title || !population || !meeting_place || !leader_id) {
        if (!title || !population || !meeting_place || !UserId) {
            res.status(422).json({data: null, message: 'insufficient parameters supplied'});
        } else {
            const newRoom = await group.create({
                title, 
                description,
                population, 
                meeting_place,
                meeting_time,
                leaderId: accessTokenData.id, 
                UserId: accessTokenData.id,
                region, 
                city,
            });
            // console.log(newRoom.dataValues)
            
            res.status(201).json({
                data: {
                    id:newRoom.dataValues.id, 
                    title:newRoom.dataValues.title,
                    description:newRoom.dataValues.description, 
                    population:newRoom.dataValues.population,
                    UserId:newRoom.dataValues.UserId, 
                    region:newRoom.dataValues.region,
                    city:newRoom.dataValues.city,
                    meeting_place:newRoom.dataValues.meetingPlace ,
                    meeting_time:newRoom.dataValues.meeting_time
                }, message: 'ok'});
        }
    }
};
