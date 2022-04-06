
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Alert, Form, } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Axios from '../API/api';

function VerifyEmail() {

    const [verificationStatus, setVerificationStatus] = useState("");
    const [authStatus, setAuthStatus] = useState(false);

    const [formData, setFormData] = useState({
        token: '',
    })

    const { token } = formData;
    const schema = Yup.object().shape({

        token: Yup.string()
            .required('Token is required'),

    });
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const current = new Date();
    const verified_date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    const navigate = useNavigate();

    const verifyEmail = () => {
        Axios.post('/user/verify-email',
            { token: token, verified_date: verified_date }
        ).then((response) => {
            console.log(response);
            if (response) {
                setVerificationStatus(response.data.message);
                console.log(response.data.message);
                setAuthStatus(response.data.verified)

                if (response.verified === "true") {
                    navigate('/login');
                }
            }
        });
    }

    return (
        <div className="container d-flex justify-content-start py-5">
            <div className="">
                <Form onSubmit={handleSubmit(verifyEmail)}>
                    <Form.Group className="mb-3" controlId="formBasiToken">
                        <Form.Label>Token</Form.Label>
                        <Form.Control name="token"
                            {...register('token')}
                            value={token}
                            name="token"
                            onChange={(e) => onChange(e)}
                            className={`input ${errors.token ? 'is-invalid' : ''}`}
                            type="token" placeholder="token"
                        />
                        <div className="invalid-feedback">{errors.token?.message}</div>

                    </Form.Group>
                    <Form.Control className="button-block mt-4 mb-3 is-block button"
                        value="Confirm" type="submit" />

                </Form>

                {!authStatus ? <div>
                    <p className='text-danger' variant='danger'>
                        {verificationStatus}
                    </p>
                </div> : <Alert variant='success'>
                    {verificationStatus}
                </Alert>}
                <div className="text-center">
                    <p className='login-link'>Now Click here to create or join&nbsp; <Link to="/workspace">Workspace</Link></p>
                </div>
            </div >
        </div >

    )
}

export default VerifyEmail