//라이브러리
import React ,{useState,useEffect} from 'react';
import axios from 'axios';

import '../css/homeLogined.css';
import { groups, userInfo } from '../components/dummy';
import RoomList from '../components/RoomList';
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Room from '../components/Room';
import { isShowLoginModalHandler } from '../redux/actions/actions';

// ! 1. react-cookie import한다.
import { withCookies, Cookies, useCookies } from 'react-cookie';

function HomeLogined() {
      // !  2. cookies는 쿠키(name : value)들을 모아놓은 javascript object이다.
  
            const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
            const history = useHistory()
             // * 로긴모달에 필요한 부분
             const dispatch = useDispatch()
             const isLogin = useSelector(state => state.isLoginReducer.isLogin)
             const showLoginModalHandler = () => { dispatch(isShowLoginModalHandler(true))};
             const [myRoomList,setMyRoomList] = useState([])
             const {region,city,add} = useSelector(state=>state.locationReducer)
             const [userName,setUserName] = useState('')
             // *   
             useEffect(()=>{
                 if(!isLogin){
                     history.push('/')
                 }
                axios.get(`http://localhost:4000/rooms/my-room-list/`,{
                    headers:{contentType:"application/json",withCredentials:"true",Authorization : `Bearer ${cookies.accessToken}`}
                })
                .then(res=>{
                    setMyRoomList(res.data.data)
                    console.log(res.data.data)
                    axios.get('http://localhost:4000/users/userinfo',{withCredentials : true})
                    .then(res => {
                        console.log(res.data)
                        setUserName(res.data.data.username)
                        
                    })
                    .catch(err => {
                        console.log('fail')// 에러창을 추후에 만들면 좋을듯 싶음
                    })
                })
            },[])
            // console.log(myRoomList)

    return (
        <div className = 'homeLogined-page'>
            
            {/* <Header /> */}
            <div className = 'homeLogined-body'>
                
                {/* <Sidebar /> */}
                <div className = 'homeLogined-room-list'>
                    {/* 유저의 위치로 바꿔야할듯 */}
                    <div className = 'homeLogined-room-location'>
                        {userName}님이 참가하고 계신 모각코 모임입니다.
                    </div>
                    <div className = '.common-room-component-list'>
                        {myRoomList
                        .map((group,idx) => {
                            return (
                                <div className = 'common-room-box' key = {idx} >
                                {isLogin ? <Link to = {`/roominfo/${group.id}`}><Room group = {group} idx = {idx}/></Link>
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