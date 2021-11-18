import React from 'react'
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { isShowRoomOutModalHandler } from '../redux/actions/actions';
import { useCookies } from 'react-cookie';

import '../css/roomOutModal.css'

function RoomOutModal() {
    const dispatch = useDispatch()
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const id = useSelector((state) => state);
    console.log('ididid', id);
    // console.log('뜸?', roomInforma);
    // const [loginId, setLoginId] = useState('');
    // const [loginPw, setLoginPw] = useState('')

    const closeRoomOutModalHandler = () => { dispatch(isShowRoomOutModalHandler(false)) };

    function roomOutRequest(e) { // 방 나가기 요청 함수
        e.preventDefault();

        const body = {
            // email: loginId,
            // password: loginPw,
            // id,
            // title
        }
        // response 적절하게 추가
        axios.patch(`https://localhost:4000/rooms/room-exit`, body, {
            withCredentials: true,
            headers: { 'contente-type': 'application/json', 
                Authorization : `Bearer ${cookies.accessToken}` 
            }
        })
        .then(res => {
            console.log('왔냐?');
        }).catch(err => {
            console.log('실패..');
        })
    }

    return (
        <div className="room-out-modal">
            <div className='room-out-modal-background' onClick={closeRoomOutModalHandler}></div>
            <div className="room-out-modal-container">
                <button className="room-out_close_btn" onClick={closeRoomOutModalHandler}>
                    <span>
                        <i></i>
                        <i></i>
                    </span>
                </button>
                <h2>모임방을 나가시겠습니까?</h2>
                <div className="room-out-modal-form">
                    <div>
                        <button className="yes-btn" onClick={(e) => roomOutRequest(e)}>예</button>
                    </div>
                    <div>
                        <button className="no-btn" onClick={closeRoomOutModalHandler}>아니요</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomOutModal
