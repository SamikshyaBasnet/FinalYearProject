import './Login.css'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/slacklogo.jpg';
import {
    Form,
    Alert,
    InputGroup
} from "react-bootstrap";
import socketClient from "socket.io-client";

import Axios from '../API/api';
import { signIn } from '../../actions';
import { isUserAuth, loadUserProfileData } from '../../actions';

function Login() {
    const baseUrl = 'http://localhost:5000';
    var socket = socketClient(baseUrl);

    const dispatch = useDispatch();
    const [loginStatus, setLoginStatus] = useState("");
    const [error, setError] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { email, password } = formData;
    const schema = Yup.object().shape({

        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),

    });
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    Axios.defaults.withCredentials = true;
    const navigate = useNavigate()

    const login = () => {
        Axios.post('/user/login',
            { email: email, password: password }
        ).then((response) => {
            console.log(response);
            if (response.data.auth === true) {
                dispatch(signIn(response.data));

                localStorage.setItem("token", response.data.token)
                localStorage.setItem("userId", response.data.userId)
                navigate('/dashboard')

            }
            else {
                setLoginStatus(response.data.message);
                setError(true);
                console.log(response.data.message);
            }
        }
        )

    }
    var userId = localStorage.getItem("userId");

    useEffect(() => {
        Axios.get(`/user/isUserAuth?userId=${userId}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        }
        ).then((response) => {
            console.log("token", response);
            if (response.data.auth === true) {
                dispatch(isUserAuth(response.data))
                //  dispatch(signIn(response.data))
                dispatch(loadUserProfileData(userId));
                navigate('/dashboard');

            }
        })
    }, [])

    const passwordVisibilityHandler = () => {
        setSeePassword(!seePassword)
    }
    return (

        <div className="login">
            <div className="login__container">
                <img className='logo' src={logo} alt="Slack Logo" />
                <h4 className='fw-bold text-center'>Sign in to Slack</h4>
                <Form onSubmit={handleSubmit(login)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            {...register('email')}
                            value={email}
                            onChange={(e) => onChange(e)}
                            name="email"
                            className={`input  ${errors.email ? 'is-invalid' : ''}`}
                            type="email" placeholder="Enter email"
                        />
                        <div className="invalid-feedback">{errors.email?.message}</div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                {...register('password')}
                                value={password}
                                name="password"
                                onChange={(e) => onChange(e)}
                                className={`input ${errors.password ? 'is-invalid' : ''}`}
                                type={seePassword ? 'text' : 'password'} placeholder="Enter Password"
                            />
                            <InputGroup.Text>
                                <i onClick={passwordVisibilityHandler}
                                    className={seePassword ? 'fas fa-eye' : 'fas fa-eye-slash'}
                                    style={{ cursor: 'pointer' }}
                                ></i>
                            </InputGroup.Text>
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </InputGroup>
                    </Form.Group>
                    <Form.Control className="button-block mt-4 mb-3 is-block button"
                        value="Sign In" type="submit" />

                </Form>
                {error ? <div className="text-center">
                    <Alert variant='danger'>
                        {loginStatus}
                    </Alert>
                </div> : <div className="text-danger text-center">

                    {loginStatus}

                </div>}

                <div className="footer d-flex">
                    <p className="forgot-password">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </p>
                    <p className='signup'>New to Slack?&nbsp;
                        <Link to="/register">Create an account</Link>
                    </p>
                    {/* <Link to="/workspace">Create an workspace</Link> */}

                </div>
            </div >
        </div >

    )
}

export default Login