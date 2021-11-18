
import React,{useEffect,useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import dotenv from "dotenv";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { groups , userInfo } from '../components/dummy'
import { isShowLoginModalHandler, isShowCreateRoomModalHandler } from '../redux/actions/actions';
import Room from '../components/Room';
import '../css/roomListPage.css'





dotenv.config();
function RoomListPage() {
    
    const dispatch = useDispatch();
    const showLoginModalHandler = () => { dispatch(isShowLoginModalHandler(true))};
    const isLogin = useSelector(state => state.isLoginReducer.isLogin)//로긴상태
    const showCreateRoomModalHandler = () => { dispatch(isShowCreateRoomModalHandler(true))};
    const closeCreateRoomModalHandler = () => { dispatch(isShowCreateRoomModalHandler(false)) }
    const {region,city,add} = useSelector(state=>state.locationReducer)
    const [myRoomList,setMyRoomList] = useState([])
    // console.log(region,city)
   useEffect(()=>{
       axios.get(`http://localhost:4000/rooms/local-room-list/`,
       {params:{city:city,region:region}}).then(res=>{
           setMyRoomList(res.data.data)
       })
   },[region,city])
    
    return (
        <div className = 'roomListPage-page'>
            <div className = 'roomListPage-body'>
                <div className = 'roomListPage-main'>
                    <div className='roomListPage-room-location'>
                        
                        
                          <div className='roomListPage-room-location-locbox'>
                            {region} {city} 에서 참여 가능한 모임방들
                          </div>
                    </div>
                    <div className='roomListPage-create-meeting'>
                        {isLogin? <button 
                                    className='roomListPage-create-meeting-btn'
                                    onClick = {showCreateRoomModalHandler}
                                    >모각코 만들기</button>
                        : <button 
                                className='roomListPage-create-meeting btn' 
                                onClick = {showLoginModalHandler} >모각코 만들기</button>}
                    </div>    
                    <div className = 'common-room-component-list'>
                    {/* history.push(`/roominfo/${res.data.data.id}`) */}
                        {/* <RoomList /> */}
                        {myRoomList!==null ? myRoomList.filter(el=>el.city===city&&el.region===region)
                        .map((group,idx) => {
                            return (
                                <div className = 'common-room-box' key ={idx}>
                                    {isLogin ? <Link to = {`/roominfo/${group.id}`}><Room group = {group} idx = {idx}/></Link>
                                    : <Room onClick = {showLoginModalHandler} group = {group} idx = {idx}/>
                                    }
                                </div>    
                            )
                            })
                        :
                        <div>{city}에 생성된 모각코모임이 없습니다.</div>
                        }
                    </div>                            
                </div>
                
            </div>
        </div>
        ) 
        
        
}
        
export default RoomListPage;
