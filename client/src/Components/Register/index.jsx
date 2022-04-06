import './register.css'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react'
import logo from '../../assets/images/slacklogo.jpg';
import { Link } from "react-router-dom";
import Axios from '../API/api';
import {
    Form,
    Row,
    Col,
    Alert,
    InputGroup
} from "react-bootstrap";
import { signUp } from '../../actions';

function Register() {
    // Dispatch
    const dispatch = useDispatch();

    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

    const [registerStatus, setRegisterStatus] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    })

    const [isVerified, setIsVerified] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const { email, username, password, confirmPassword } = formData;
    const schema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),

    });
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    }

    const current = new Date();
    const join_date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
    const verified_date = "";
    const token = "";
    Axios.defaults.withCredentials = true;

    const handleRegister = () => {
        Axios.post('/user/register',
            { username: username, email: email, password: password, join_date: join_date, isVerified: isVerified, verified_date: verified_date, toke: token })
            .then((response) => {
                console.log(response);
                if (response) {
                    setRegisterStatus(response.data.message);
                    setIsRegistered(response.data.registered)
                    console.log(response.data.message);
                }
                dispatch(signUp(response.data));
            });
    }
    const passwordVisibilityHandler = () => {
        setSeePassword(!seePassword)

    }
    const confirmPasswordVisibilityHandler = () => {
        setSeeConfirmPassword(!seeConfirmPassword)
    }

    return (
        <div className="register">
            <div className="register__container">
                <img className='logo' src={logo} alt="Slack Logo" />
                <h4 className='fw-bold mb-4 text-center'>Sign up to Slack</h4>
                <Form onSubmit={handleSubmit(handleRegister)}>
                    <Row>
                        <Col md="6">
                            <Form.Group className="mb-4" controlId="formBasicEmail">
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
                        </Col>
                        <Col md="6">
                            <Form.Group className="mb-4" controlId="formBasicUsername">
                                <Form.Control
                                    {...register('username')}
                                    value={username}
                                    onChange={(e) => onChange(e)}
                                    name="username"
                                    className={`input  ${errors.username ? 'is-invalid' : ''}`}
                                    type="username" placeholder="Enter Username"
                                />
                                <div className="invalid-feedback">{errors.username?.message}</div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <Form.Group className="mb-4" controlId="formBasicPassword">
                                <InputGroup className="mb-3">
                                    <Form.Control name="password"
                                        {...register('password')}
                                        value={password}
                                        name="password"
                                        onChange={(e) => onChange(e)}
                                        className={`input ${errors.password ? 'is-invalid' : ''}`}
                                        type={seePassword ? 'text' : 'password'} placeholder="Password"
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
                        </Col>
                        <Col md="6">
                            <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                                <InputGroup>
                                    <Form.Control name="confirmPassword"
                                        {...register('confirmPassword')}
                                        value={confirmPassword}
                                        name="confirmPassword"
                                        onChange={(e) => onChange(e)}
                                        className={`input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        type={seeConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password"
                                    />
                                    <InputGroup.Text>
                                        <i onClick={confirmPasswordVisibilityHandler}
                                            className={seeConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}
                                            style={{ cursor: 'pointer' }}
                                        ></i>
                                    </InputGroup.Text>
                                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>

                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Control className="button-block mt-3 mb-4 is-block button" value="Sign Up" type="submit" />
                </Form>

                {isRegistered ? <div>
                    <Alert variant='success'>
                        {registerStatus}
                    </Alert>
                </div> : <p className='text-danger text-center'>
                    {registerStatus}
                </p>}
                <div className="footer text-center">
                    <p className='signup'>Already have an account?&nbsp; <Link to="/">Login</Link></p>
                </div>
            </div >
        </div >

    )
}

export default Register