//라이브러리
import React from 'react';
import axios from 'axios';

import '../css/homeLogined.css';
import { groups, userInfo } from '../components/dummy';
import RoomList from '../components/RoomList';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Room from '../components/Room';
import { isShowLoginModalHandler } from '../redux/actions/actions';


function HomeLogined() {
             // * 로긴모달에 필요한 부분
             const dispatch = useDispatch()
             const isLogin = useSelector(state => state.isLoginReducer.isLogin)
             const showLoginModalHandler = () => { dispatch(isShowLoginModalHandler(true))};
             // *   
    return (
        <div className = 'homeLogined-page'>
            
            {/* <Header /> */}
            <div className = 'homeLogined-body'>
                
                {/* <Sidebar /> */}
                <div className = 'homeLogined-room-list'>
                    {/* 유저의 위치로 바꿔야할듯 */}
                    <div className = 'homeLogined-room-location'>
                        {userInfo[0].username}님이 참가하고 계신 모각코 모임입니다.
                    </div>
                    <div className = 'common-room-component-list'>
                        {userInfo[0].joinGroup
                        .map((group,idx) => {
                            return (
                                <div className = 'common-room-box' key = {idx} >
                                {isLogin ? <Link to = '/roominfo'><Room group = {group} idx = {idx}/></Link>
                                : <Room onClick = {isShowLoginModalHandler}group = {group} idx = {idx}/>
                            }
                                </div>
                            )
                        })}
                        

                    </div>
                </div>
            </div>
        </div>
    )

    // .homeLogined-room-list .homeLogined-room-location {
    //     padding : 30px ;
    //     font-size: larger;
    //     text-align: center;
    //     background-color: aqua;
    //     position :absolute;
    //     width : 100%;
    //     height : 100px;
    //     left:0;
    //     top : 50px;
    // }
    // .homeLogined-room-list .homeLogined-room-location .homeLogined-roombox {
    //     background-color: chocolate;
    // }
}

export default HomeLogined


/* background-color: chartreuse;
    font-size: larger;
    text-align: center; */