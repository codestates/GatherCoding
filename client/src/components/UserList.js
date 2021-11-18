import React from 'react'
import '../css/userList.css'
function UserList({image,username,blog}) {
    // console.log(image,username,blog)
    return (
        <div className='userlist-page'>
            {/* {image?
            <div className='userlist-profile'><img src={image}></img></div>:
            <div className='userlist-profile'><img src={'client/src/images/default_profile.png'}></img></div>} */}

            {/* //! 이미지 액박 안뜨게하는거 부탁드립니다.. 척척박사 윤환님.. */}
            <div className='userlist-profile'><img alt = "profile-user-img"></img></div>
            <span className='userlist-username'>{username}</span>
            <span className='userlist-blog'><a href={blog} target='_blank'>{blog}</a></span>
        </div>
    )
}

export default UserList
