import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import { useHistory } from "react-router-dom";

import { isEmpty } from 'lodash';

import { Link } from 'react-router-dom';

// primereact components 
import { Card } from 'primereact/card';

import { Button } from 'primereact/button';

// service
import LoginService from 'services/login';

//utils
import { response } from 'utils/response';

import { isLoginAuth } from 'utils/common';

// images 
import logo from 'assets/images/logo.png';

import CityoneDynamicForm from 'shared-components/cityone-form/index';

import { validations } from 'utils/validations';


const ForgetPassword = () => {

  let history = useHistory();

  const ls = new LoginService();

  // initial values 

  const [forgetPasswordFormInitialValue] = useState({
    email_address: null
  });

  // properties 

  const [forgetPasswordFormFields] = useState({
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

    }
  })

  // forgot password section starts
  const forgetPasswordFormOnsubmit = async (data, err) => {

    let forgetPasswordResponse;
    try {
      if (isEmpty(err)) {

        forgetPasswordResponse = await response.add({
          service: ls,
          method: 'forgetPassword',
          data: { item: data },
          toasterMessage: {
            success: 'Please check the reset password link sent to your email address',
            error: 'The email address entered is not valid'
          }
        });

        if (forgetPasswordResponse) {
          if (!forgetPasswordResponse.data.isError) {
            history.push('/login');
          }
        }

      }
    } catch (err) {
      console.log(err)
    }

  }
  // forgot password section end

  const forgetPasswordSubmitButtonGroup = () => {

    return (
      <div className="p-field p-col-12">
        <Button label="Send email" className="p-button-primary" type="submit" />
      </div>
    )
  }

  const isLogin = () => {
    if (isLoginAuth()) {
      history.push('/')
    }
  }

  useEffect(() => {
    isLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div className='login-section forget-section'>
      <div className="card-wrapper">

        <Card>
          <div className="login">

          <div className="login-logo p-mb-4 p-text-center">
            <img src={logo} alt="" />
          </div>
          <br></br><br></br>

            <h2 className="title p-mb-4"> Forgot Password</h2>

            <div className="p-fluid">
              <CityoneDynamicForm
                initialValues={forgetPasswordFormInitialValue}
                fields={forgetPasswordFormFields}
                onFormSubmit={forgetPasswordFormOnsubmit}
                submitButtonGroup={forgetPasswordSubmitButtonGroup}>
              </CityoneDynamicForm>
            </div>

            <Link className="forget-pass" to="/login">Login</Link>

          </div>
        </Card>
      </div>
    </div>
  );

}

// export default ForgetPassword
const mapStateToProps = (state) => ({
  ld: state.forgetPasswordDetails
});

export default connect(mapStateToProps)(ForgetPassword);