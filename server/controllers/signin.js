const user = require('../models/user');
const group = require('../models/group');
const token = require('./token/index');

module.exports = {
    post: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(404).json('you should enter all the required information');
        } else {
            const data = await user.findOne({ where: { email, password }});
            if (!data) {
                res.status(404).json('not authorized');
            } else {
                // console.log(data.username);
                const accessToken = token.generateAccessToken(data.toJSON()); 
                const username = data.username;
                // console.log(accessToken);
                // res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
                // ! 토큰은 무조건 쿠키로 전달
                res.cookie("accessToken", accessToken); // {data: {accessToken: accessToken}} 에서 쿠키로 전달로 수정
                res.status(200).json({ "username": username, "message": "ok" });
            }
        }   
        
    }
};

