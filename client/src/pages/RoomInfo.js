import React, { useEffect,useState } from 'react';
import { useLocation } from "react-router-dom";
import { useSelector ,useDispatch} from 'react-redux';
import '../css/roominfo.css';
import { userInfo } from '../components/dummy'
import UserList from '../components/UserList';
import MapPick from '../components/kakao/map/MapPick';
import MapContainer from '../components/MapContainer';
import axios from 'axios';
import { withCookies, Cookies, useCookies } from 'react-cookie';
import MapInRoom from '../components/kakao/map/MapInRoom';

import { isShowRoomOutModalHandler,isShowRoomInModalHandler } from '../redux/actions/actions';

function RoomInfo({ match }) {
    // console.log(roomId)
    const {id} = match.params
    const roomId = parseInt(id,10)
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const [roomInforma,setRoomInforam] = useState({})
    console.log(cookies)
    console.log('JWT : ',cookies.jwt)
    console.log('액세스토큰 : ', cookies.accessToken)
    const dispatch = useDispatch();
    const isLogin = useSelector(state => state.isLoginReducer.isLogin)
    const { pathname } = useLocation();
    useEffect(() => {
        // 페이지 이동시 스크롤 맨 위로 오게한다.
        window.scrollTo(0, 0);
        //db에서 방id랑 맞는 정보가져와야함. 방id는 roomId, 방을 만드는게 아니라 들어가는거
        console.log('왔나요')
        axios.get(`http://localhost:4000/rooms/new-room/${roomId}`,
        {
            headers:{contentType:"application/json",withCredentials:"true",Authorization : `Bearer ${cookies.accessToken}`}
        }
        ).then(res=>{
            const {UserId,city,description,id,leader_id,meeting_place,meeting_time,population,region,title} = res.data.data
            const roomInformation = {UserId,city,description,id,leader_id,meeting_place,meeting_time,population,region,title}
            setRoomInforam(roomInformation)
            console.log(roomInformation)
        })

    }, [pathname]);
    //

    const showRoomOutHandler = () => {
        dispatch(isShowRoomOutModalHandler(true));
    }
    const roomInRequest = function() {
        dispatch(isShowRoomInModalHandler(true));
    }
    console.log(roomInforma.title)
    return (
        <div className="roominfo-background">
            <div className="roominfo-container">
                <div className='roominfo-map'>
                    {/* <MapPick /> */}
                    <MapInRoom meeting_place={roomInforma.meeting_place}/>
                </div>
                <div className='roominfo-page'>
                    <div className='roominfo-info-div'>
                        <div className="roominfo-info-box">
                            <div className="blue-screen">
                            <h2>방제목: {roomInforma.title}</h2>
                            <div className='roominfo-info-outer'>
                                <p>약속 시간 : {roomInforma.meeting_time}</p>
                                <div className="roominfo-description">
                                    코딩해야지 코딩해야지 반복하다 <br />
                                    결국 자버리는 분들 <br /><br />
                                    같이 코딩해요<br /><br />
                                    다같이 파이팅~~!
                                </div>
                                <div className='roominfo-info-person'>
                                    {"(조인테이블에서 인원구해오기)명"}/    {roomInforma.population}
                                </div>
                            </div>
                            {/* 방장이면 */}

                            {/* <div className='roominfo-change-room-info'>
                            <button>모각코 방 정보 변경</button>
                            </div> */}
                            <button className='roominfo-change-room-info'>모각코 방 정보 변경</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='roominfo-user-list'>
                    <div className='user-item'>
                        <div className='roominfo-user-list-title'>모임 구성원</div>
                        {userInfo.map((user, i) => {
                            const { image, username, blog } = user;
                        // console.log(image, username, blog);
                            return (<div key={i}>
                                <UserList image={image} username={username} blog={blog} />
                            </div>
                            )
                        })}
                    </div>
                    <button className='roominfo-exit-room'>모각코 나가기</button>
                </div>
            </div>
        </div>
    )
}

export default RoomInfo
