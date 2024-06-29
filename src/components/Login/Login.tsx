import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link , useNavigate} from 'react-router-dom';
import './Login.css';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import axios from 'axios';

interface IUserData {
  userId : string;
 };
 

const Login: React.FC = () => {
  const initialValues = {
    email: '',
    password: ''
  };
  const singIn = useSignIn<IUserData>();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-zA-Z]/, 'Password must contain letters')
      .matches(/[0-9]/, 'Password must contain numbers')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain special characters')
      .required('Required')
  });

  const onSubmit = async (values: any) => {
    console.log('Form data', values);
    try {
      const res = await axios.get(
        `http://localhost:5270/api/User?email=${values.email}&password=${values.password}`
      );
      console.log(res.data);
      if(res.status === 200){
        if(singIn({
          auth : {
            token : res.data.token,
            type : 'Bearer'
          },
          userState : {
            userId : res.data.userId,
          }
        })){
          try {
            const profile = await axios.get(
              `http://localhost:5270/api/Profile/${res.data.userId}`,
              {
                headers : {
                  Authorization : `Bearer ${res.data.token}`
                }
              }
            );
            if(profile.data.isVerified === "not verified"){
              navigate('/profile-complition');
            }
            else{
              navigate('/');
            }
          } catch (error) {
            console.log('failed')
          }
        }
        else{
          console.log('Login failed');
        }
      }
    } catch (error) {
      console.log('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        <Form className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="error-message" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <Field type="password" id="password" name="password" />
              <div className="tooltip">
                <span className="tooltip-icon">?</span>
                <span className="tooltip-text">
                  Password must be at least 8 characters long, contain letters, numbers, and special characters.
                </span>
              </div>
            </div>
            <ErrorMessage name="password" component="div" className="error-message" />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </Form>
      </Formik>
      <p>
        Don't have an account? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;