import React from 'react';
import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

const ViewContainer = ({ children }: Props) => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };
    return <>
        <Navbar expand="lg" className="navbar-light bg-light justify-content-between">
            <div className="mx-3">
                <Navbar.Brand data-testid='nav-brand'>Antique Store</Navbar.Brand>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={() => navigate('/auctions')}>Auctions</Nav.Link>
                    <Nav.Link data-testid='visits-link' onClick={() => navigate('/quotation-visits')}>{localStorage.getItem('user_type') === 'Admin' ? 'Quotation Visits' : 'My Visits'}</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <div className="mx-3">
                <Button data-testid='logout-button' className="border border-primary p-2 rounded link-underline link-underline-opacity-0" onClick={logout}>Log out</Button>
            </div>
        </Navbar>
        <div className="container bg-white border rounded shadow-sm mt-5 p-5">
            {children}
        </div>
    </>;
};

export default ViewContainer;
