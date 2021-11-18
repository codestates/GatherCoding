import React, { useEffect,useState } from 'react';
import { useLocation } from "react-router-dom";
// import { useSelector } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import '../css/roominfo.css';
// import { userInfo } from '../components/dummy'
import UserList from '../components/UserList';
import MapPick from '../components/kakao/map/MapPick';
import MapContainer from '../components/MapContainer';
import axios from 'axios';
import { withCookies, Cookies, useCookies } from 'react-cookie';
import MapInRoom from '../components/kakao/map/MapInRoom';
import { isShowRoomOutModalHandler } from '../redux/actions/actions';
import { isShowRoomInModalHandler } from '../redux/actions/actions';

function RoomInfo({ match }) {
    // console.log(roomId)
    const dispatch = useDispatch()
    const {id} = match.params
    const roomId = parseInt(id,10)
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [roomInforma,setRoomInforma] = useState({})
    const [userInfo,setUserInfo] = useState([])
    // console.log(cookies)
    // console.log('JWT : ',cookies.jwt)
    // console.log('액세스토큰 : ', cookies.accessToken)
    console.log(roomInforma)
    const isLogin = useSelector(state => state.isLoginReducer.isLogin)
    const isShowRoomInModal = useSelector(state => state.isShowRoomInModalReducer.isShowRoomInModal);
    const currentUserList = useSelector(state => state.currentUserListReducer);
    console.log(currentUserList);
    const { pathname } = useLocation();
    const dispatch = useDispatch();

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
            // console.log('informa?', roomInforma)
            console.log(res.data.data.title)
            // const {UserId,city,description,id,leader_id,meeting_place,meeting_time,population,region,title} = res.data.data
            // const roomInformation = {UserId,city,description,id,leader_id,meeting_place,meeting_time,population,region,title}
            setRoomInforma({...roomInforma,...res.data.data})
            console.log(roomInforma)
            return res.data.data.title
        }).then(title=>{
            axios.post('http://localhost:4000/rooms/room-entry',
            {roomTitle:title},
            {headers:{withCredentials:"true", Authorization : `Bearer ${cookies.accessToken}`, contentType:"application/json"}}
            ).then(res=>{
                setUserInfo(res.data.data)

        
            })
        })

    }, [pathname]);

    const showRoomOutHandler = () => {
        dispatch(isShowRoomOutModalHandler(true));
    }
    const roomInRequest = function() {
        dispatch(isShowRoomInModalHandler(true));
    }
    console.log(roomInforma.title)
    return (
        <div>
            <div className='roominfo-page'>
                <div className='roominfo-map'>
                    {/* <MapPick /> */}
                    <MapInRoom meeting_place={roomInforma.meeting_place}/>
                </div>
                <div className='roominfo-info-div'>
                    <div className='roominfo-meeting-time'>
                        약속 시간 : {roomInforma.meeting_time}
                    </div>

                    <div className='roominfo-info-outer'>
                        <div className='roominfo-info-inner'>
                            <h1>{roomInforma.title}</h1>
                            <div>
                                {roomInforma.description}
                            </div>
                        </div>
                    <div className='roominfo-info-person'>
                            {"(조인테이블에서 인원구해오기)명"}/{roomInforma.population}
                    </div>
                </div>
                    {/* 방장이면 */}

                    {/* <div className='roominfo-change-room-info'>
                        <button>모각코 방 정보 변경</button>
                    </div> */}
                    <button className='roominfo-change-room-info'>모각코 방 정보 변경</button>

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
                    {/* {currentUserList.map((item, i) => {
                        const { image, username, blog } = item;
                        return (<div key={i}>
                            <UserList image={image} username={username} blog={blog} />
                            </div>)
                    })} */}
                </div>
                <button className='roominfo-exit-room' onClick={showRoomOutHandler} >모각코 나가기</button>
                <button className='roominfo-enter-room' onClick={roomInRequest}>모각코 참여하기</button>
            </div>
        </div>
    )
}

export default RoomInfo
