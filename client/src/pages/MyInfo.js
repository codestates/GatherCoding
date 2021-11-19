import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import CheckSignMsg from '../components/CheckSignMsg'
import UpdateModal from '../components/UpdateModal'
import '../css/myInfo.css'
function MyInfo() {
    const [loading, setLoading] = useState(true);

    const [curUserPw, setCurUserPw] = useState('');
    const [updatePw, setUpdatePw] = useState('')
    const [checkUpdatePw, setCheckUpdatePw] = useState(''); 
    const [curUserNickname, setCurUserNickname] = useState('');
    const [fixUserName, setFixUserName] = useState('')
    const [updateUrl, setUpdateUrl] = useState(''); 
    const [curUserImage, setCurUserImage] = useState(null);
    const [updateImage, setUpdateImage] = useState(null);
    const [sucUpdate, setSucUpdate] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(null);
    
    const [validPw, setValidPw] = useState(false); // 유효성(문자, 숫자, 특수문자 각 하나씩)
    const [samePw, setSamePw] = useState(false); // 비번 확인용
    // 닉네임 중복확인 하기 싫어 힘들어

    // 이미지는 삭제 말고 기본이미지로 변경 누르면 변경 ㄱㄱ 아니면 그냥 이미지를 하지말고 폰트 어썸 같은데서 그냥 아이콘 하나 넣자 귀여운걸로

//     <div className="image-upload-box">
//     <input name="image" className="input-blind" ref={inputValue} type="file" onChange={(e) => inputFileHandler(inputValue, setSignUpImage)}/>
//     {signUpImage ? <div className="img_preview" onClick={(e) => inputBtn(e, inputValue)} style={{ backgroundImage: `url('${URL.createObjectURL(signUpImage) }')`}}
//   ></div>: <div className="img_preview" onClick={(e) => inputBtn(e, inputValue)}></div>} 끼에에에에에엑 사용할듯
    const history = useHistory()
    useEffect(() => {
        /*const curUser = window.sessionStorage.getItem('email');*/
        // 로딩 넣으면 좋을듯
        axios.get('http://localhost:4000/users/userinfo',{withCredentials : true})
            .then(res => {
                // console.log(res.data.data.image)
                const blog = res.data.data.blog;
                setUpdateUrl(blog)
                const username = res.data.data.username;
                setCurUserNickname(username)
                setFixUserName(username)
                const image = res.data.data.image;
                setCurUserImage(image)
            })
            .catch(err => {
                console.log('fail')// 에러창을 추후에 만들면 좋을듯 싶음
            })

    }, [])

    function conditionPassword(updatePw) { // 숫자, 영문, 특수문자 각 1자리 이상이면서 8자에서 16자 사이 통과
        let reg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/
        if (!reg.test(updatePw)) {
            return false;
        }
        return true
    }

    useEffect(() => {
        if(!conditionPassword(updatePw)){
            setValidPw(false);
        }else{
            setValidPw(true);
        }
        if(updatePw !== checkUpdatePw){
            setSamePw(false);
        }else{
            setSamePw(true);
        }
    }, [validPw, updatePw, checkUpdatePw])

    function userPwInfo(e){
        setCurUserPw(e.target.value)
    }
    function chagePwInfo(e){
        setUpdatePw(e.target.value)
    }
    function checkChagePwInfo(e){
        setCheckUpdatePw(e.target.value)
    }
    function changeNickName(e){
        setCurUserNickname(e.target.value)
    }
    function chageUrl(e){
        setUpdateUrl(e.target.value)
    }
    // function changeImage(e){
    //     setCurUserImage(e.target.value)
    // }

    function updateInfoRequest(e){ // -------------업데이트 요청----------------
        e.preventDefault()
        const formData = new FormData();
        const email = window.sessionStorage.getItem('email') // github 가입 email 토큰이 들어감 이거를 그래서 해결하는 방법을 찾아야할거 같습니다.
        console.log(email)

        formData.append('email', email)
        formData.append('password', curUserPw)
        formData.append('changePassword', updatePw)
        formData.append('blog', updateUrl)
        formData.append('username', curUserNickname);
        // formData.append('curImage', curUserImage); // 삭제용
        if(!updateImage){
            formData.append('image', curUserImage); // 링크
        }else{
            formData.append('image', updateImage); // 파일
        }

        axios.put('http://localhost:4000/users/info-change',formData ,{
            headers: {
                'content-type': 'multipart/form-data',
            },
            withCredentials : true
        })
            .then(res => {
                console.log('유저 정보 업데이트 성공')
                setSucUpdate(true)
                setShowUpdateModal(true)
                // !
            }).then(res=> history.push('/'))
            .catch(err => {
                console.log('fail')// 에러창을 추후에 만들면 좋을듯 싶음
                setSucUpdate(false)
                setShowUpdateModal(true)
            })
    }

    const inputValue = useRef(null);

    function inputFileHandler(inputValue, setCurUserImage) {
        const image = inputValue.current.files;
        setUpdateImage(image[0])
        console.log(curUserImage)
    }

    function inputBtn(e, inputValue){
        e.preventDefault();
        inputValue.current.click()
    }


    return (
        <div className = 'my-info-background'>
            <div className = 'my-info-container'>
                <h2>{fixUserName}님의 회원정보</h2>
                <div className="my-info-update">
                    <form className="my-info-form" onSubmit={(e) => updateInfoRequest(e)}>
                        <input className="my-info-password" type="password" name="password" placeholder="현재 비밀번호" value={curUserPw} onChange={(e) => userPwInfo(e)} />
                        <input className="update-pw" type="password" name="password" placeholder="수정 비밀번호" value={updatePw} onChange={(e) => chagePwInfo(e)} />
                        <input className="check-update-pw" type="password" placeholder="비밀번호 확인" value={checkUpdatePw}onChange={(e) => checkChagePwInfo(e)} />{!samePw ?  <CheckSignMsg message={'비밀번호가 일치하지 않습니다.'} /> : null}{!validPw ?  <CheckSignMsg message={'숫자, 영문, 특수문자 각 1자리 이상의 8~16 자리'} /> : null}
                        <input className="update-nick-name" type="text" name="username" placeholder="닉네임" value={curUserNickname} onChange={(e) => changeNickName(e)} />
                        <input className="update-url" type="text" name="blog" placeholder="깃허브 주소" value={updateUrl} onChange={(e) => chageUrl(e)} />
                        <div className="update-image-box">
                            <input name="image" className="update-input-blind" ref={inputValue} type="file" onChange={(e) => inputFileHandler(inputValue, setCurUserImage)}/>
                            {updateImage ?<div className="update-img-preview" onClick={(e) => inputBtn(e, inputValue)} style={{ backgroundImage: `url('${URL.createObjectURL(updateImage) }')`}}></div> : <div className="update-img-preview" onClick={(e) => inputBtn(e, inputValue)}><img src={curUserImage} /></div>}
                            <p>프로필 이미지</p>
                        </div>
                        <button type="submit" className="update-btn" disabled={
                            validPw && samePw ? false : true}>정보변경하기</button>
                    </form>
                    {/* {!sucUpdate ? <div className="update-alert"><p>정보 변경 실패 비밀번호를 확인해주세요</p></div> : <div className="update-alert"><p>정보가 변경 됐습니다.</p></div>} */}
                    {showUpdateModal ? <UpdateModal setShowUpdateModal={setShowUpdateModal} showUpdateModal={showUpdateModal} sucUpdate={sucUpdate} /> : null}
                </div>
            </div>
        </div>
    )
}

export default MyInfo