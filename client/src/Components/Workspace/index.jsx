import React, { useState, useEffect } from 'react'
import collabImg from "../../assets/images/collabimg.svg";
import {
    Button, Row, Col,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './workspace.css';

import { Link } from "react-router-dom";

const Home = () => {
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
                <div className="login-register">
                    <Link to="/login">
                        <Button className="login_button button mt-4 is-block">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button onClick={createPage} className="register_button mx-3 button mt-4 is-block">Register</Button>
                    </Link>
                </div>
                <Row className="container py-3" >
                    <Col md="7" className="left px-5 pt-5 mt-5">
                        <h1 className='fw-bold px-5 mt-5'>Create a new Slack Workspace</h1>
                        <p className='px-5 mt-2'>Slack gives your team a home - a place where they can talk and
                            work together. To create a new workspace, click the button below.
                        </p>
                        <Button onClick={createPage} className="create_button px-5 mx-5 button mt-2 is-block">Let's Go</Button>
                    </Col>
                    <Col md="5" className="mx-">
                        <img className='img' src={collabImg} height={500} width={500} />
                    </Col>
                </Row>
            </div >

        </div >
    )
}

export default Home