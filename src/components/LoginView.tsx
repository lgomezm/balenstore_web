import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { AuthService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

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
                    navigate("/quotation-visits");
                } else {
                    navigate("/auctions");
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
        <Row className='mt-3 align-items-center justify-content-center'>
            <Col mr={4}></Col>
            <Col mr={4} className='bg-white border rounded shadow-sm mt-5 p-5'>
                <h1 data-testid='login-title'>Log in</h1>
                {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        data-testid='login-email'
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        data-testid='login-password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => onPasswordKeyDown(e.key)} />
                </Form.Group>
                <Button data-testid='login-button' onClick={onLoginClicked}>Log In</Button>
            </Col>
            <Col mr={4}></Col>
        </Row>
    </Container>;
}

export default LoginView;
