import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import { useHistory } from "react-router-dom";

import { Link } from 'react-router-dom';

// utils 

import { getUserType, isLoginAuth } from 'utils/common';

import { isEmpty } from 'lodash';

import { response } from 'utils/response';

import { lStorage } from 'utils/storage';

// primereact components 
import { Card } from 'primereact/card';

import { Button } from 'primereact/button';


// state 

import { LOGIN } from 'store/actions/type/login';

// services 
import LoginService from 'services/login';

// images 
import logo from 'assets/images/logo.png';

import CityoneDynamicForm from 'shared-components/cityone-form/index';

import { validations } from 'utils/validations';

const Login = (props) => {

  let history = useHistory();

  const ls = new LoginService();

  const [isShowSSO] = useState(false);

  // initial values 
  const [loginFormInitialValue] = useState({
    email_address: null,
    password: null
  });

  // properties 

  const [loginFormFields] = useState({
    email_address: {

      properties: {
        type: 'InputText',
        label: 'Email address',
        fieldWrapperClassNames: 'p-col-12',
        primeFieldProps: {
        },
        validations: {
          required: validations.required,
          pattern: validations.email
        }
      },

    },
    password: {

      properties: {
        type: 'InputText',
        label: 'Password',
        fieldWrapperClassNames: 'p-col-12',
        primeFieldProps: {
          type: 'password'
        },
        validations: {
          required: validations.required,
        }
      },


    }
  })

  // Login form submit section starts
  const loginFormOnsubmit = async (data, err) => {

    let loginResponse, loginResponseData;

    try {
      if (isEmpty(err)) {

        loginResponse = await response.add({
          service: ls,
          method: 'login',
          data: { item: data },
          toasterMessage: {
            success: "Login successfully",
            error: 'Please login with correct email address and password'
          }
        })

        loginResponseData = loginResponse.data;

        if (!loginResponseData.isError) {
          lStorage.set('authInfo', loginResponseData.data);
          props.dispatch({ type: LOGIN, payload: loginResponseData.data });
          getUserType() !== "CS" ? history.push('/dashboard') : history.push('/dashboard');
        }

      }
    } catch (err) {
      console.log(err)
    }

  }
  // Login form submit section end

  const isLogin = () => {
    if (isLoginAuth()) {
      history.push('/')
    } else {
      history.push('/login')
    }
  }

  const loginSubmitButtonGroup = () => {
    return (
      <div className="p-field p-col-12">
        <Button label="LogIn" className="p-button-primary login-button" type="submit" />
      </div>
    )
  }

  // const showSSO = () => {
  //   setShowSSO(!isShowSSO)
  // }

  // const processLogin = async ({ myInfo }) => {

  //   let loginResponse, ssoLoginInfo;

  //   console.log(myInfo)

  //   ssoLoginInfo = {
  //     ssoAuthenticate: { results: [myInfo] }
  //   }

  //   try {

  //     if (ssoLoginInfo.ssoAuthenticate.results.length > 0 && myInfo) {

  //       loginResponse = await response.add({
  //         service: ls,
  //         method: 'ssoLogin',
  //         data: { item: ssoLoginInfo },
  //         toasterMessage: {
  //           success: "Login successfully",
  //           error: 'Please login with registered email'
  //         }
  //       })

  //       if (loginResponse && loginResponse.data && !loginResponse.data.isError) {
  //         lStorage.set('authInfo', loginResponse.data.data);
  //         props.dispatch({ type: LOGIN, payload: loginResponse.data.data });
  //         history.push('/dashboard');
  //       } else {
  //         signOut()
  //       }
  //     }

  //   } catch (err) {
  //     console.log(err)
  //   }

  // }

  useEffect(() => {
    isLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='login-section'>
      <div className="card-wrapper">


        <Card>
          <div className="login">
          <div className="loging-logo p-text-center">
            <img src={logo} alt="" />
            <br></br><br></br>
          </div>

            {
              (!isShowSSO) ? <div>
                <h2 className="title p-mb-4"> Login</h2>

                <CityoneDynamicForm
                  initialValues={loginFormInitialValue}
                  fields={loginFormFields}
                  onFormSubmit={loginFormOnsubmit}
                  submitButtonGroup={loginSubmitButtonGroup}>
                </CityoneDynamicForm>


                <Link className="forget-pass" to="/forgot-password">Forgot Password?</Link>

  
              </div> :
                <div>
                  {/* <HfnFirebaseAuth doLogin={processLogin}></HfnFirebaseAuth>
                  <div className="p-field p-col-12 p-text-center" style={{ cursor: 'pointer' }}>
                    <p onClick={showSSO}><u>Login</u></p>
                  </div> */}
                </div>
            }

          </div>
        </Card>
      </div>
    </div>
  );

}

// export default Login
const mapStateToProps = (state) => ({
  ld: state.loginDetails
});

export default connect(mapStateToProps)(Login);
