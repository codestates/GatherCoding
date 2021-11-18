import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { useSelector,shallowEqual, useDispatch } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles"
import { userInfo } from "../../dummy";
import axios from "axios";
import AppBar from "../appbar/AppBar"
import LinearProgress from "@material-ui/core/LinearProgress"
// ! 1. react-cookie import한다.
import { withCookies, Cookies, useCookies } from 'react-cookie';
import { isLoadingHandler, isShowCreateRoomModalHandler } from "../../../redux/actions/actions";

const useStyles = makeStyles(theme => ({
  
  map: {
    width: "100%",
    height: "100%"
  },
  progress: {
    position: "fixed",
    zIndex: 9999,
    width: "100%",
    top: 56,
    [theme.breakpoints.up("sm")]: {
      top: 64
    }
  }
}))

const Map = ({ title ,meetingTime ,population, description }) => {
  const history = useHistory();
  const {lat,lon,region,city, add} = useSelector((state=>state.locationReducer),shallowEqual)
  const [pending, setPending] = useState(true)
  // const meetingPlace = useSelector((state=>state.meetingPlaceReducer),shallowEqual)
  const [map, setMap] = useState(null)
  const kakao = window.kakao
  const classes = useStyles()
  const dispatch = useDispatch()
  const [meetingPlace,setMeetingPlace] = useState([region,city,add])
  const isLoading = useSelector(state => state.isLoadingReducer.isLoading)
  const [centerPosition,setCenterPosition] = useState([lat,lon])
  const [createdRoom,setCreatedRoom] = useState(false)
  /**
   * 장소 검색
   * @param keyword 검색어
   */
  // !  2. cookies는 쿠키(name : value)들을 모아놓은 javascript object이다.
  
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  console.log(cookies)
  console.log('JWT : ',cookies.jwt)
  console.log('액세스토큰 : ', cookies.accessToken)
  // !


  const searchPlace = keyword => {
    setPending(true)
    const places = new kakao.maps.services.Places()
    places.keywordSearch(keyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const firstItem = result[0]
        // console.log(firstItem)
        const { y, x } = firstItem
        
        // console.log(meetingPlace)
        const moveLatLng = new kakao.maps.LatLng(y,x)
        map.panTo(moveLatLng)
          
        
        
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 없습니다.")
      } else {
        alert("서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
      setPending(false)
    })
  }
  

  const handleSearch = searchText => {
    if (searchText) {
      searchPlace(searchText)
    }
  }



  useEffect(() => {
    console.log('만들기클릭했니?',createdRoom)
    if(createdRoom===true){
      axios.post('http://localhost:4000/rooms/new-room',{
        title ,population, description,
        meeting_time : meetingTime,
        region:meetingPlace[0],
        city : meetingPlace[1],
        UserId : userInfo[0].id,
        meeting_place:meetingPlace[2]
      },{
          headers:{contentType:"application/json",withCredentials:"true",Authorization : `Bearer ${cookies.accessToken}`}
        })
        .then(res=>{
          
          
          history.push(`/roominfo/${res.data.data.id}`)
          dispatch(isLoadingHandler(true))
          dispatch(isShowCreateRoomModalHandler(false))
          console.log(res.data.data.id)
          return res
        })
        .then(res=>{
          const {id,title,description,population,UserId,region,city,meetingPlace} = res.data.data
          console.log({id,title,description,population,UserId,region,city,meetingPlace})
          console.log('여긴와?')

        //   axios.post('http://localhost:4000/rooms/room-entry',
        //   {roomTitle:title},
        //     {headers:{withCredentials:"true", Authorization : `Bearer ${cookies.accessToken}`, contentType:"application/json"}}
        // ).then(res=>{console.log(res.data.data)
        // })
        dispatch(isLoadingHandler(false))
      }) 
      setCreatedRoom(false)
    }
    console.log("effect")
    const container = document.getElementById("map") //지도를 담을 영역의 DOM 레퍼런스
    console.log('여기왔니')
    let options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(centerPosition[0],centerPosition[1]), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    }
   
    
    const map = new kakao.maps.Map(container, options) //지도 생성 및 객체 리턴
    //마커가 표시될 위치입니다.
    var marker = new kakao.maps.Marker({ 
      // 지도 중심좌표에 마커를 생성합니다 
      position: map.getCenter() 
    }); 


    // var markerPosition  = new kakao.maps.LatLng(33.450701, 126.570667); 
    // // 마커를 생성합니다
    //   var marker = new kakao.maps.Marker({
    //     position: markerPosition,
    //     clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
    // });
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
    
var iwContent = '<div style="padding:5px;"> <a href = "http://localhost:3000/roominfo">' + meetingPlace[2] + '</a> <br/></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    iwPosition = new kakao.maps.LatLng(lat,lon); //인포윈도우 표시 위치입니다
    // iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

// 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({
    // map: map,
    position : iwPosition, 
    content : iwContent,
    // removable : iwRemoveable 
});
infowindow.open(map, marker); 
  
// * 마커에 클릭이벤트를 등록합니다
kakao.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map, marker); 
  console.log('hello')
    //  axios.post('http://localhost:4000/rooms/new-room',{
    //     title ,meetingTime ,population, description,
    //     region:meetingPlace[0],
    //     city : meetingPlace[1],
    //     UserId : userInfo[0].id,
    //     meetingPlace:meetingPlace[2]
    //   },{
    //       headers:{contentType:"application/json",withCredentials:"true",Authorization : `Bearer ${cookies.accessToken}`}
    //     }).then(res=>console.log(res))

});
// // ! 마우스 올리면 메시지 보임->지도먼저 보이고-> 방정보 생성으로 가자
// function displayInfowindow(marker, title) {
//   var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

//   infowindow.setContent(content);
//   infowindow.open(map, marker);
// }
// kakao.maps.event.addListener(marker, 'mouseover', function() {
//   displayInfowindow(marker, '마커를 클릭하면 방이 생성됩니다.');
// });
// * 마우스 내리면 메시지 사라짐
// kakao.maps.event.addListener(marker, 'mouseout', function() {
//   infowindow.close();
// });
// * 맵에 클릭이벤트 등록
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {       
  
  //* infowindow 생성
  infowindow.open(map, marker);  
  // * 클릭한 위도, 경도 정보를 가져옵니다 
  var latlng = mouseEvent.latLng; 
  console.log(latlng.La, latlng.Ma)
  //*  마커 위치를 클릭한 위치로 옮깁니다
  marker.setPosition(latlng);
  
  //* infowindow 마커위에 생성
  infowindow.setPosition(latlng)
  console.log('도착')
  // const newLatLng = new kakao.maps.LatLng(latlng.La, latlng.Ma)
  // map.panTo(newLatLng)
  // !

  setCenterPosition([latlng.getLat(),latlng.getLng()])
  //* 좌표를 주소로 변환
  axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${latlng.getLng()}&y=${latlng.getLat()}&input_coord=WGS84`
    ,{headers:{Authorization:`KakaoAK ${process.env.REACT_APP_REST_API}`}}
    )
    .then(res=>res.data.documents[0].address)
    .then((address)=>{
      // const {address_name,region_2depth_name,region_1depth_name} = address
      // const metad = {meetRegion : address_name, meetCity:region_2depth_name,meetAdd : region_1depth_name}
      setMeetingPlace([address.region_1depth_name,address.region_2depth_name,address.address_name])
      console.log(meetingPlace)
      return false
    })
    .catch(err=>console.log(err))  
});
    
    setMap(map)
    setPending(false)
  }, [meetingPlace,createdRoom])


  const sendRoomInfo = (e) => {
    console.log(meetingPlace)
    setCreatedRoom(true)
    // console.log(createdRoom)
    // axios.post('http://localhost:4000/rooms/new-room',{
    //     title ,meetingTime ,population, description,
    //     region:meetingPlace[0],
    //     city : meetingPlace[1],
    //     UserId : userInfo[0].id,
    //     meetingPlace:meetingPlace[2]
    //   },{
    //       headers:{contentType:"application/json",withCredentials:"true",Authorization : `Bearer ${cookies.accessToken}`}
    //     })
    //     .then(res=>{
          
    //       dispatch(isLoadingHandler(true))
          
    //       // history.push("/roominfo")
    //       // dispatch(isShowCreateRoomModalHandler(false))
    //       // console.log(res)
    //     })
    //     .then(res=>{
    //       axios.get('http://localhost:4000/rooms/new-room',
    //         {headers:{withCredentials:"true",Authorization : `Bearer ${cookies.accessToken}`, contentType:"application/json"}}
    //     ).then(res=>{
    //       console.log(res.data)
    //     })
    //     dispatch(isLoadingHandler(false))
    //   })
      

  }

  return (
    <>
      <AppBar onSearch={handleSearch} />
      {pending && <LinearProgress color="secondary" className={classes.progress} />}
      <div id="map" className={classes.map} ></div>
      <button className="create-room-btn" onClick = {(e)=>sendRoomInfo(e)}>모각코 만들기</button>
    </>
  )
}

export default Map
