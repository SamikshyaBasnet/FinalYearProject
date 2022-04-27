import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react'
import logo from '../../assets/images/slacklogo.jpg';
import { Link } from "react-router-dom";
import {
    Form,
    Col,
    Alert,
    InputGroup,
} from "react-bootstrap";
import Axios from '../API/api';

function ResetPassword() {
    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
    const [responseStatus, setResponseStatus] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        token: '',
        password: '',
        confirmPassword: '',
    })


    const { token, password, confirmPassword } = formData;
    const schema = Yup.object().shape({

        token: Yup.string()
            .required('Token is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),

    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    }

    const reset = () => {
        Axios.post('/user/reset-password',
            { password: password, token: token }
        ).then((response) => {
            console.log(response);
            if (response.data.message) {
                setResponseStatus(response.data.message);
                setIsSuccess(response.data.success)
                console.log(response.data.message);
            }

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
                <h4 className='fw-bold mb-4 text-center'>Reset Password</h4>
                <Form onSubmit={handleSubmit(reset)}>
                    <Col md="12">
                        <Form.Group className="mb-3" controlId="formBasiToken">
                            <Form.Label>Token</Form.Label>
                            <Form.Control name="token"
                                {...register('token')}
                                value={token}
                                onChange={(e) => onChange(e)}
                                className={`input ${errors.token ? 'is-invalid' : ''}`}
                                type="token" placeholder="token"
                            />
                            <div className="invalid-feedback">{errors.token?.message}</div>

                        </Form.Group>
                    </Col>
                    <Col md="12">
                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <InputGroup className="mb-3">
                                <Form.Control name="password"
                                    {...register('password')}
                                    value={password}
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
                            </InputGroup>
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </Form.Group>
                    </Col>
                    <Col md="12">
                        <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                            <InputGroup>
                                <Form.Control name="confirmPassword"
                                    {...register('confirmPassword')}
                                    value={confirmPassword}
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
                            </InputGroup>
                            <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                        </Form.Group>
                    </Col>
                    <Form.Control className="button-block mt-3 mb-4 is-block button" value="Reset Password" type="submit" />
                </Form>
                {!isSuccess ? <div>
                    <p className='text-danger' variant='danger'>
                        {responseStatus}
                    </p>
                </div> : <Alert variant='success'>
                    {responseStatus}
                </Alert>}

                <div className="footer text-center">
                    <p>Back to<Link to="/">&nbsp;Login</Link></p>
                </div>
            </div >
        </div >

    )
}

export default ResetPassword