import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import { useHistory, useRouteMatch } from "react-router-dom";

import { isArray, isEmpty, isObject, isString } from "lodash";

import { toaster } from "utils/toaster";

// primereact components 
import { Card } from 'primereact/card';

import { Button } from 'primereact/button';

// service 
import LoginService from 'services/login';

// images 
import logo from 'assets/images/logo.png';

import CityoneDynamicForm from 'shared-components/cityone-form/index';

// utils 
import { isLoginAuth } from 'utils/common';

import { validations } from 'utils/validations';

import { lStorage } from 'utils/storage';


const ResetPassword = (props) => {

  let history = useHistory();

  let token = useRouteMatch("/reset-password/:slug");

  const ls = new LoginService();

  // initial values 

  const [resetPasswordFormInitialValue] = useState({
    new_password: null,
    confirm_password: null
  });

  // properties 

  const [resetPasswordFormFields] = useState({
    new_password: {

      properties: {
        type: 'InputText',
        label: 'New password',
        fieldWrapperClassNames: 'p-col-12',
        primeFieldProps: {
          type: 'password'

        },
        validations: {
          required: validations.required,
          validations: {
            required: validations.required,
          }
        }
      },

    },
    confirm_password: {

      properties: {
        type: 'InputText',
        label: 'Confirm password',
        fieldWrapperClassNames: 'p-col-12',
        primeFieldProps: {
          type: 'password'

        },
        validations: {
          required: validations.required,
          validations: {
            required: validations.required,
          }
        },
      },
    }
  })

  // reset password section starts
  const resetPasswordFormOnsubmit = async (data, err) => {
    let resetToken, resetData;

    if (token && token.params) {
      resetToken = token.params.slug
    } else {
      resetToken = ""
    }
    if (props.editProfile === true) {
      resetData = {
        password: data.new_password,
        confirm_password: data.confirm_password,
        email_address: lStorage.get('authInfo').email_address
      }
    } else {
      resetData = {
        password: data.new_password,
        confirm_password: data.confirm_password,
        token: resetToken
      }
    }

    let resetPasswordResponse;

    if (isEmpty(err)) {
      if (data.confirm_password !== data.new_password) {
        toaster.error('The password and confirm password does not match')
        return;
      }
      try {
        resetPasswordResponse = await ls.resetPassword(resetData)
        if (resetPasswordResponse) {
          if (!resetPasswordResponse.data.isError) {
            toaster.success('Password updated successfully')
            history.push('/login');
          }
          else {
            let errMsg = "", errObj;
            let defaultError = 'Unable to reset password';
            if (defaultError) {

              if (!isEmpty(resetPasswordResponse.data.message) && isString(resetPasswordResponse.data.message)) {
                errMsg = resetPasswordResponse.data.message
              } else if (isArray(resetPasswordResponse.data.message)) {

                if (isObject(resetPasswordResponse.data.message[0])) {

                  errObj = Object.keys(resetPasswordResponse.data.message[0]);

                  if (isArray(errObj)) {
                    errMsg = resetPasswordResponse.data.message[0][errObj[0]][0];
                  }

                } else {
                  errMsg = resetPasswordResponse.data.message[0];
                }

              } else {
                errMsg = defaultError;
              }
            }
            toaster.error(errMsg)
          }
        }

      }
      catch (err) {
        console.log(err)
      }
    }

  }
  // reset password section end

  const gotoLogin = () => {
    if (props.editProfile === true) {
      history.push('/')
    } else {
      history.push('/login')
    }
  }

  const resetPasswordSubmitButtonGroup = () => {

    return (
      <div className={props.editProfile === true ? "p-d-flex p-jc-end p-mt-3 p-pr-2" : "p-col-12 p-d-flex p-jc-between"}>
        <Button label="Cancel" className={props.editProfile === true ? 'p-button-secondary p-mr-2' : "p-button-secondary p-mr-3"} type="cancel" onClick={gotoLogin} />
        <Button label="Submit" className="p-button-primary" type="submit" />
      </div>
    )
  }

  const isLogin = () => {
    if (isLoginAuth()) {
      history.push('/')
    }
  }

  useEffect(() => {
    if (props.editProfile !== true) {
      isLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {props.editProfile !== true ? <div className='login-section reset-section'>
        <div className="card-wrapper">

          <Card>

          {props.editProfile === true ? <></> : <div className="login-logo p-mb-4 p-text-center">
            <img src={logo} alt="" />
          </div>}
            <br></br><br></br>
            <div className="login">

              <h2 className="title p-mb-4"> Reset Password</h2>

              <div className="p-fluid">
                <CityoneDynamicForm
                  initialValues={resetPasswordFormInitialValue}
                  fields={resetPasswordFormFields}
                  onFormSubmit={resetPasswordFormOnsubmit}
                  submitButtonGroup={resetPasswordSubmitButtonGroup}>
                </CityoneDynamicForm>
              </div>

            </div>
          </Card>
        </div>
      </div> :
        <div className="login">

          <div className="card-wrapper">
            <div className="p-fluid">
              <CityoneDynamicForm
                initialValues={resetPasswordFormInitialValue}
                fields={resetPasswordFormFields}
                onFormSubmit={resetPasswordFormOnsubmit}
                submitButtonGroup={resetPasswordSubmitButtonGroup}>
              </CityoneDynamicForm>
            </div>
          </div>
        </div>

      }
    </>
  );

}

// export default ResetPassword
const mapStateToProps = (state) => ({
  ld: state.resetPasswordDetails
});

export default connect(mapStateToProps)(ResetPassword);