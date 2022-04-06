
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Form, } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Axios from '../API/api';
import { createWorkspace } from '../../actions'

function CreateWorkSpace() {

    const [creationStatus, setCreationStatus] = useState("");
    const [error, setError] = useState(false);

    const [formData, setFormData] = useState({
        workspace_name: '',
    })

    const { workspace_name } = formData;
    const schema = Yup.object().shape({
        workspace_name: Yup.string()
            .required('Workspace name is required'),

    });
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const current = new Date();
    const created_date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.userId);

    const handleCreateServer = () => {
        Axios.post(`/workspace/create?workspace_name=${workspace_name}&userId=${userId}`,
            { created_date: created_date }
        ).then((response) => {
            console.log(response);
            if (response.data.created === true) {
                console.log(response);
                dispatch(createWorkspace(response.data))
                setCreationStatus("")
                navigate('/dashboard')
            }
            else {
                setError(true);
                setCreationStatus(response.data.message)
                console.log(response.data.message);
            }
        });
    }

    return (
        <div className="container createworkspace_container">
            <div>
                <h1 className="fw-bold mb-4">What's the name of your Company or team?</h1>
                <Form onSubmit={handleSubmit(handleCreateServer)}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Control name="name"
                            {...register('workspace_name')}
                            value={workspace_name}
                            name="workspace_name"
                            onChange={(e) => onChange(e)}
                            className={`input ${errors.workspace_name ? 'is-invalid' : ''}`}
                            type="name" placeholder="Workspace Name"
                        />
                        <div className="invalid-feedback">{errors.workspace_name?.message}</div>

                    </Form.Group>
                    <Form.Control className="button-block  mt-4 mb-3 is-block button"
                        value="Create" type="submit" />

                </Form>
                {error ? <Alert variant='danger'>
                    {creationStatus}
                </Alert> : ""}
            </div >
        </div >

    )
}

export default CreateWorkSpace