//라이브러리
import HomeLogined from './pages/HomeLogined';
import React ,{useEffect} from 'react'
import { Route, Switch } from "react-router-dom";
import axios from 'axios';
import './css/reset.css';
import './css/homePage.css';
import Home from './pages/Home';
// ! 리액트쿠키 우선 해놓음 나중에 안쓰면지우기


// import Header from './components/Header'
// import Sidebar from './components/Sidebar'

import LoginModal from './components/LoginModal'
import SignUpModal from './components/SignUpModal'

import RoomOutModal from './components/RoomOutModal'
import RoomInModal from './components/RoomInModal'
import RoomInfoChangeModal from './components/RoomInfoChangeModal'
import MyInfo from './pages/MyInfo'
// import { useSelector, useDispatch } from 'react-redux';
//리덕스
// import { isLoginHandler, isShowLoginModalHandler } from './redux/actions/actions';
// * 사이드바, 헤더 사용시 주석까지 복붙하기 


import { useSelector, useDispatch, shallowEqual } from 'react-redux';
// *
//리덕스


import FirstPage from './pages/FirstPage';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RoomInfo from './pages/RoomInfo';
import { changeAddress, changeCity, changeLat, changeLon, changeRegion, isLoadingHandler, isLoginHandler, isCurrentId, isShowLoginModalHandler, setAccessToken } from './redux/actions/actions';
import CreateRoom from './components/CreateRoom';

// import Oauth from './components/Oauth'

import { ThemeProvider } from "@material-ui/core/styles"
import { theme } from "./theme"
// ! 1. react-cookie import한다.
import { withCookies, Cookies, useCookies } from 'react-cookie';
import RoomPage from './pages/RoomPage';

function App() {
  // console.log(window.sessionStorage.getItem('email'))
  const isLogin = useSelector(state => state.isLoginReducer.isLogin)
  const isShowLoginModal = useSelector(state => state.isShowLoginModalReducer.isShowLoginModal)
  const isShowSignUpModal = useSelector(state => state.isShowSignUpModalReducer.isShowSignUpModal)
  const isShowRoomOutModal = useSelector(state => state.isShowRoomOutModalReducer.isShowRoomOutModal)
  const isShowRoomInModal = useSelector(state => state.isShowRoomInModalReducer.isShowRoomInModal)
  const isShowRoomInfoChangeModal = useSelector(state => state.isShowRoomInfoChangeModalReducer.isShowRoomInfoChangeModal)
  const dispatch = useDispatch()
  const isShowCreateRoomModal = useSelector(state => state.isShowCreateRoomModalReducer.isShowCreateRoomModal)
  const isLoading = useSelector(state => state.isLoadingReducer.isLoading)
  //shallowEqual : 이전값이 바뀌었을경우에만 렌더링함. useSelector에서 한번에 두 값 가져올때 사용
  const {region,city,lat,lon} = useSelector((state=>state.locationReducer),shallowEqual)
  const loginHandler = (val) => {dispatch(isLoginHandler(val))}
  const closeLoginModalHandler = () => { dispatch(isShowLoginModalHandler(false)) };
  const openLoginModalHandler = () => { dispatch(isShowLoginModalHandler(true)) };
  const curLoginId = useSelector(state => state.isCurrentIdReducer.isCurrentIdHandler) // 로그인 한 유저의 현아이디
  const cookieAccessToken = useSelector(state=>state.accessTokenReducer.accessToken)


  // !  2. cookies는 쿠키(name : value)들을 모아놓은 javascript object이다.
  
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
  // console.log(cookies)
  // console.log('JWT : ',cookies.jwt)
  // console.log('액세스토큰 : ', cookies.jwt)
  // !
  // const realLoginHandler = (boolean) => { // 로그인 상태 기능
  //   
  // }
  const curLoginedId = (val) => {dispatch(isCurrentId(val))}

  useEffect(() => { // 혹시 몰라서 지워도 기능 및 콘솔 이상 없는지 확인
    
  }, [isLogin, isShowLoginModal])

  useEffect(() => {
    // curLoginedId(window.sessionStorage.getItem('email'))
    // console.log(curLoginId)
    maintainLogin()
  })

  useEffect(()=> {
    if(!window.sessionStorage.getItem('email')){
      afterComponentRendering()
    }
  }, []);

  function maintainLogin(){
    if(window.sessionStorage.getItem('email')){
      loginHandler(true)
    }else{
      loginHandler(false)
    }
  }

  // const loginedId 
  // useEffect(() => {
  //   const maintainLogin = window.localStorage.getItem('')
  //   if(!maintainLogin){
  //     dispatch(isLoginHandler(true))
  //   }else{
      // dispatch(isCurrentId(??))
  //   }
  // })



  // function(){ // 로그인 및 로그인 유지 기능 구현 해야 댐

  // }
  
  function onGeoOk(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    // console.log(typeof lat,lon )
    dispatch(changeLon(lon))
    dispatch(changeLat(lat))
    // console.log('axios진입전')
    // ? : 유저의 좌표를 주소로 변환하는 카카오 API
    
    axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&input_coord=WGS84`
    ,{headers:{Authorization:`KakaoAK ${process.env.REACT_APP_REST_API}`}}
    )
    .then(res=>{
        // console.log(res)
        console.log('JWT : ',cookies.jwt)
        console.log('액세스토큰 : ', cookies.accessToken)
        // dispatch(setAccessToken(cookies.accessToken))
        
        dispatch(changeAddress(res.data.documents[0].address.address_name))
        dispatch(changeRegion(res.data.documents[0].address.region_1depth_name))
        dispatch(changeCity(res.data.documents[0].address.region_2depth_name)) 
        dispatch(isLoadingHandler(false))
        
    })
    .then(res=>{
      console.log(isLogin,cookies.accessToken)
      // ?     2. DB에 유저의 주소 저장
      if(isLogin){
      axios.post('http://localhost:4000/users/location-registration',{
          region,city
          //! 3 .headers의 Authorization 에 accessToken을 넣어준다.
        },{headers:{withCredentials:"true",Authorization : `Bearer ${cookies.accessToken}`, contentType:"application/json"}}
        )
      }else {
        console.log('로긴해주세요')
      }
    })
    // .then(res=>console.log(res))
    .catch(e=>console.log(e))
  }
  function onGeoError(){
      alert("위치권한을 확인해주세요");
  }
  function gtloc () {navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError)}
  useEffect(()=>{
    // if(!isLogin) 
      gtloc()
      //!어떻게 빠르게 받아오지??
  
  
          
     // * 위치, 로그인, 로그아웃시 useEffect실행
  },[region,city,isLogin])

  // const dispatch = useDispatch()
  // const logoutHandler = () => { dispatch(isLoginHandler(false)) };
  // const showLoginModalHandler = (e) => { dispatch(isShowLoginModalHandler(true))};
  // console.log(isLogin)
  // console.log(isShowLoginModal)

  async function getAccessToken(authorizationCode) {
    let token;
    // let url = "http://localhost:4000/users/oauth";

    await axios({
      method: 'post',
      url: "http://localhost:4000/users/oauth",
      data: {
        authorizationCode: authorizationCode
      }
    })
    .then((result) => {
      // console.log(result.data.accessToken);
      token = result.data.accessToken;
      window.sessionStorage.setItem('email', token);
      maintainLogin();
    }).then(() => {
      closeLoginModalHandler();
    })
    .then(() => dispatch(setAccessToken(token)));
    // loginHandler(true);
  }
  
  function afterComponentRendering() {
    const url = new URL(window.location.href)
    const authorizationCode = url.searchParams.get('code')
    // console.log(authorizationCode)
    if (authorizationCode) {
      // authorization server로부터 클라이언트로 리디렉션된 경우, authorization code가 함께 전달됩니다.
      // ex) http://localhost:3000/?code=5e52fb85d6a1ed46a51f
      return getAccessToken(authorizationCode)
    }
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
      <Header />
      <Sidebar />
      {/* {isLogin ? <HomeLogined /> : <Home />} */}
      {/* {isShowLoginModal ? <LoginModal /> : null} */}
      {/* {} */}
      {/* {console.log(isLogin)} */}
      {/* {console.log(isShowLoginModal)} */}
      <Switch>
        <Route exact path = '/'><FirstPage /></Route>
        <Route path = '/myroom'><HomeLogined /></Route>
        {/* //! db에 있는 roomlist 연결하게 되면 220번줄 수정하기 */}
        {/* <Route path = '/roominfo'><RoomInfo /></Route> */}
        {/* // ! */}
        <Route path = '/roominfo/:id' component={RoomInfo}></Route>        
        <Route path = '/myinfo'><MyInfo /></Route>
      </Switch>
      {/* {console.log('모각코만들기모달',isShowCreateRoomModal)} */}
      {isShowLoginModal ? <LoginModal /> : null}
      {isShowSignUpModal ? <SignUpModal /> : null}
      {isShowRoomOutModal ? <RoomOutModal /> : null}
      {isShowRoomInModal ? <RoomInModal /> : null}
      {isShowRoomInfoChangeModal ? <RoomInfoChangeModal /> : null}
      {isShowCreateRoomModal ? <CreateRoom /> : null}
      </ThemeProvider>
    </div>
    // 위에 Link로 사용할 수 있게 페이지나 컴포넌트로 만들어두기
  );
}


export default App;