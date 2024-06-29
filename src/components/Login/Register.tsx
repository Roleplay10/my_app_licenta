import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

const Register: React.FC = () => {
  const initialValues = {
    email: '',
    password: '',
    confirmPassword: ''
  };
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
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Required')
  });

  const onSubmit = async (values: any) => {
    console.log('Form data', values);
    try {
      const res = await axios.post(
        `http://localhost:5270/api/User`,
        {
          email: values.email,
          password: values.password
        }
      );
      console.log(res.data);
      if (res.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.log('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        <Form className="register-form">
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field type="password" id="confirmPassword" name="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="div" className="error-message" />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </Form>
      </Formik>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;