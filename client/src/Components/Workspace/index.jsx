import React, { useState, useEffect } from 'react'
import collabImg from "../../assets/images/collabimg.svg";
import {
    Button, Row, Col, Form,
    Alert,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './workspace.css';
import Axios from '../API/api';
// import { createWorkspace } from '../../actions';
//import { joinWorkspace } from '../../actions';

const Workspace = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [loginStatus, setLoginStatus] = useState("");
    const [error, setError] = useState(false);
    const [authStatus, setAuthStatus] = useState(false);

    const [formData, setFormData] = useState({
        workspace_name: '',
    })

    const { workspace_name } = formData;
    const schema = Yup.object().shape({
        workspace_name: Yup.string()
            .required('Workspace name is required')

    });
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        console.log(e.target.value);
    }

    const createPage = () => {
        navigate('./create')
    }

    return (
        <div className='workspace_container'>
            <div className="create_container">
                <Row className="container py-3" >
                    <Col md="7" className="left px-5 pt-5 mt-5">
                        <h1 className='fw-bold px-5 mt-5'>Create a new Slack Workspace</h1>
                        <p className='px-5 mt-2'>Slack gives your team a home - a place where they can talk and
                            work together. To create a new workspace, click the button below.
                        </p>
                        <Button onClick={createPage} className="create_button mx-5 button mt-2 is-block">Create a workspace</Button>
                    </Col>
                    <Col md="5" className="mx-">
                        <img className='img' src={collabImg} height={500} width={500} />
                    </Col>
                </Row>
            </div >
            <div className="open_container container text-center">
                <h1 className=''>OR</h1>
                <Row className="form px-5 mx-5 py-5">
                    <h1 className='fw-bold mb-3'>Join a Workspace</h1>
                    <Form onSubmit={handleSubmit()}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Control
                                {...register('workspace_name')}
                                value={workspace_name}
                                onChange={(e) => onChange(e)}
                                name="name"
                                className={`input  ${errors.workspace_name ? 'is-invalid' : ''}`}
                                type="name" placeholder="Enter workspace name"
                            />
                            <div className="invalid-feedback">
                                <Alert variant='danger'>
                                    {errors.workspace_name?.message}
                                </Alert>
                            </div>
                        </Form.Group>
                        <Form.Control className="button-block mt-4 mb-3 is-block button"
                            value="Join" type="submit" />

                    </Form>
                    {error ? <div className="text-center">
                        <Alert variant='danger'>
                            {loginStatus}
                        </Alert>
                    </div> : ""}
                </Row>
            </div>
        </div >
    )
}

export default Workspace