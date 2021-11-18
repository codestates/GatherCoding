import React from 'react'
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { isCurrentUserListHandler, isShowRoomInModalHandler } from '../redux/actions/actions';
import UserList from './UserList';
import '../css/roomInModal.css'
import { withCookies, Cookies, useCookies } from 'react-cookie';

function RoomInModal() {
    const dispatch = useDispatch()

    // const [loginId, setLoginId] = useState('');
    // const [loginPw, setLoginPw] = useState('')
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    console.log(cookies)
    console.log('JWT : ',cookies.jwt)
    console.log('액세스토큰 : ', cookies.accessToken)
    const closeRoomInModalHandler = () => { dispatch(isShowRoomInModalHandler(false)) };
    const currentUserListHandler = (arr) => { dispatch(isCurrentUserListHandler(arr))};
    

    async function roomInRequest(e) { // 방 참여하기 요청 함수
        e.preventDefault();

        const body = {

            // email: loginId,
            // password: loginPw,
            id: 'dummyId',
            roomTitle: 'dummyTitle',
            headrs: {
                'contente-type': 'application/json'
            }
        }
        // const conf = {
        //     headrs: {
        //         'contente-type': 'application/json',
        //         ''
        //     },
        //     withCredentials: true
        // }
        // API가 조금 수정되어야 할 듯. 
        // delete 메소드 -> put 메소드
        // delete-room -> room-exit
        // response 적절하게 추가
        return axios.post(`http://localhost:4000/rooms/room-entry`, body, 
        {headers:{contentType:"application/json",withCredentials:"true",Authorization : `Bearer ${cookies.accessToken}`}})
            .then(res => {
                if (res.status === 200) { // 잘받아오면
                    // dispatch()
                    // ???
                    const userInfoArray = res.data.data;
                    console.log(userInfoArray, 'RoomIn버튼확인용');
                    
                    currentUserListHandler(userInfoArray);
                    closeRoomInModalHandler();
                }
            }).catch(err => {
                if (err) {
                    // 실패했다고 떠야 될 듯. alert 같은 것으로?
                    console.log(err);
                }
            })
    }

    return (
        <div className="room-in-modal">
            <div className='room-in-modal-background' onClick={closeRoomInModalHandler}></div>
            <div className="room-in-modal-container">
                <button className="room-in_close_btn" onClick={closeRoomInModalHandler}>
                    <span>
                        <i></i>
                        <i></i>
                    </span>
                </button>
                <h2>참여하시겠습니까?</h2>
                <div className="room-in-modal-form">
                    <div>
                        <button className="yes-btn" onClick={roomInRequest}>참여하기</button>
                    </div>
                    <div>
                        <button className="no-btn" onClick={closeRoomInModalHandler}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomInModal
