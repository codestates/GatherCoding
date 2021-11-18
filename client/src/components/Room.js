import React from 'react'


import '../css/room.css';
function Room({onClick, group, idx}) {
    // console.log(group)
    return (
    <div className="room-list-container">      
            <div className="shadow_eff"></div>
            <button onClick = {onClick} className = 'roomListPage-room' key = {idx}>
                <div className="room-name">방 이름 : {group.title}</div>
                <div className="room-people">인원 : {group.currentPopulation}/{group.population}</div>
                <div className="room-locate">코딩 장소 : {group.meeting_place}</div>
                <div className="room-time">약속시간 : {group.meeting_time}</div>
            </button>  
    </div>      
    )
}

export default Room
