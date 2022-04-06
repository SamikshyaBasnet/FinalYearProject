
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react'
import logo from '../../assets/images/slacklogo.jpg';
import { Link } from "react-router-dom";
import {
    Form,
    Col,
    Alert
} from "react-bootstrap";
import Axios from '../API/api';

function ForgotPassword() {

    const [responseStatus, setResponseStatus] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
    })
    const { email } = formData;
    const schema = Yup.object().shape({

        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),

    });
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    }

    Axios.defaults.withCredentials = true;
    const sendEmail = () => {
        Axios.post('/user/forgot-password',
            { email: email }
        ).then((response) => {
            console.log(response);
            if (response) {
                setResponseStatus(response.data.message);
                setIsSuccess(response.data.success)
                console.log(response.data.message);
            }

        });
    }

    return (
        <div className="register">
            <div className="register__container">
                <img className='logo' src={logo} alt="Slack Logo" />
                <h4 className='fw-bold mb-4 text-center'>Forgot Password?</h4>
                <h5 className="py-3">Send us your email. We will send a link to reset your password.</h5>
                <Form onSubmit={handleSubmit(sendEmail)}>
                    <Col md="12">
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
                    </Col>

                    <Form.Control className="button-block mt-3 mb-4 is-block button" value="Send" type="submit" />
                </Form>
                {!isSuccess ? <div>
                    <p className='text-danger' variant='danger'>
                        {responseStatus}
                    </p>
                </div> : <Alert variant='success'>
                    {responseStatus}
                </Alert>}
                <div className="footer">
                    <p>Back to<Link to="/">&nbsp;Login</Link></p>
                </div>
            </div >
        </div >

    )
}

export default ForgotPassword