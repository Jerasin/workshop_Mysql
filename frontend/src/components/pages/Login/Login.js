import React, { useState, useEffect , useContext } from "react";
import "./Login.css";
import Popup from "./../../Popup/Popup";
import { useHistory, useLocation } from "react-router-dom";
import { httpClient } from "./../../../utils/HttpClient";
import FacebookLogin from "react-facebook-login";

import { apiUrl, server, FB_LOGIN, GOOGLE_LOGIN } from "./../../../Constatns";
import { AuthContext } from "../../../App";

export default function Login() {
  // ไว้เปลื่ยน path
  let history = useHistory();
  // ไว้ดู path ปัจจุบัน
  let location = useLocation();

  const {authen , setAuthen , forceUpdate} = useContext(AuthContext)
  const [disabled, setDisabled] = useState(false);
  const [isError, setisError] = useState(false);
  const [isDuplicate, setisDuplicate] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  

  // const [authen, setAuthen] = useState({
  //   email: null,
  //   password: null,
  //   user_role: "user",
  // });

  const { email, password, user_role } = authen;

  // Clear State
  const closePopup = () => {
    setOpenPopup(false);
    setisError(false);
    setisDuplicate(false);
    setDisabled(false);
  };

  const isLogin = async () => {
    setDisabled(true);
    if (!email && !password) {
      setisError(true);
      setOpenPopup(true);
      return
    }
    let result = await httpClient.post(server.LOGIN_URL , authen)
    if(result.data.status === 200){
      localStorage.setItem("localID", result.data.result)
      forceUpdate();
      history.push('/main')
      return
    }
  };

  const responseFacebook = (response) => {
    try {
      setAuthen({
        isLogin: true,
        email: response.email,
        password: response.id,
        user_role: "user",
      });
      
      history.push("/main");
    } catch (err) {
      alert(err);
    }
  };

  const isLoginFb = () => {
    console.log(authen);
  };

  // Popup Component
  const isPopup = () => {
    if (openPopup) {
      if (isError) {
        let error = "Error";
        return (
          <Popup
            onPopupClose={() => {
              closePopup();
            }}
            content={error}
          />
        );
      }
      if (isDuplicate) {
        let error = "Duplicate";
        return (
          <Popup
            onPopupClose={() => {
              closePopup();
            }}
            content={error}
          />
        );
      }
    }
  };
  
  return (

    <div className="container-fluid">
      <div className="container">
        {/* Popup Show State */}
        {isPopup()}
        <div className="container-sm">
          <form>
            <div className="mb-3">
              <h3 className="text-header">
                <center>Login</center>
              </h3>
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email :
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                aria-describedby="emailHelp"
                onChange={(e) => {
                  setAuthen({ ...authen, email: e.target.value });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password :
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={(e) => {
                  setAuthen({ ...authen, password: e.target.value });
                }}
              />
            </div>
            <div className="login_social">
              <center>
                <div>
                  <h5 className="text-social">Login Social</h5>
                </div>
                {/* fa-2x edit size */}
                <center className="icon-container">
                  <div className="icon-fb">
                    <a href={apiUrl + server.FB_LOGIN}>
                      <i className="fab fa-facebook fa-2x" />
                    </a>
                  </div>
                  <div className="icon-go">
                    <a href={apiUrl + server.GOOGLE_LOGIN}>
                      <i className="fab fa-google  fa-2x" />
                    </a>
                  </div>
                </center>
              </center>
            </div>
            <div>
              <div className="container-fb">
                <FacebookLogin
                  appId="870240086864574"
                  autoLoad={false}
                  textButton=""
                  fields="name,email,picture"
                  onClick={() => {
                    isLoginFb();
                  }}
                  callback={responseFacebook}
                  cssClass="btn btn-primary"
                  icon="fa-facebook"
                />
              </div>

              <div className="btn_register">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    isLogin();
                  }}
                >
                  Login
                </button>
              </div>

              <div className="btn_cancel">
                <button
                  type="submit"
                  className="btn btn-secondary"
                  onClick={() => {
                    history.push("/register");
                  }}
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
 
 );
  
}
