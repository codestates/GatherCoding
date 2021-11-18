import React from 'react'
import { useDispatch } from 'react-redux';
import { isLoginAlertHandler } from '../redux/actions/actions';

import '../css/loginAlert.css'

function LoginAlert() {
    const dispatch = useDispatch();
    const closeIsLoginAlertHandler = () => {dispatch(isLoginAlertHandler(false))};

    

        return(
            <>
            <div className="login-alert-background">
            </div>
            <div className="login-alert-container">
            <p>로그인에 실패하였습니다. <br /> 아이디 혹은 비밀번호를  확인하여 주세요</p>
            <button className="login-alert-close-btn" onClick={() => (closeIsLoginAlertHandler())}>
                    <span>
                        <i></i>
                        <i></i>
                    </span>
                </button>
            </div>
            </>
        )
}

export default LoginAlert