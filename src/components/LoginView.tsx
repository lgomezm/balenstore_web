import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { AuthService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onPasswordKeyDown = (key: string) => {
        if (key === "Enter") {
            onLoginClicked();
        }
    };

    const onLoginClicked = () => {
        setErrorMessage('');
        if (!email || !password) {
            setErrorMessage('Email and password are required');
            return;
        }
        AuthService.login(
            email, password,
            (response) => {
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh', response.refresh);
                localStorage.setItem('user_type', response.user_type);
                if (response.user_type === 'Admin') {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            },
            (error) => {
                if (error.response.data.detail) {
                    setErrorMessage(error.response.data.detail);
                } else {
                    setErrorMessage('Something went wrong');
                }
            }
        );
    }

    return <Container>
        {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="name@example.com" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => onPasswordKeyDown(e.key)} />
        </Form.Group>
        <Button onClick={onLoginClicked}>Log In</Button>
    </Container>;
}

export default LoginView;
