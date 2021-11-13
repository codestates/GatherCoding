//라이브러리
import React from 'react';
import axios from 'axios';

import '../css/homeLogined.css';
import { groups, userInfo } from '../components/dummy';

function HomeLogined() {
    return (
        <div className = 'page'>
            
            {/* <Header /> */}
            <div className = 'body'>
                
                {/* <Sidebar /> */}
                <div className = 'room-list'>
                    {/* 유저의 위치로 바꿔야할듯 */}
                    <div className = 'room-location'> {userInfo.username}님이 참가하고 계신 모각코 모임입니다.</div>
                    {userInfo.joinGroup
                        .map((group,idx) => {
                        return (
                            
                                <button className = 'room' key = {idx}>
                                    <div>방 이름 : {group.title}</div>
                                    <div>인원 : {group.currentPopulation}/{group.population}</div>
                                    <div>코딩 장소 : {group.gather_location}</div>
                                    <div>리더 : {group.leader}</div>
                                </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default HomeLogined
