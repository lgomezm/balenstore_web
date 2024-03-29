import React from 'react';
import { Button } from "react-bootstrap";
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
                <a className="navbar-brand">Antique Store</a>
            </div>
            <div className="mx-3">
                {localStorage.getItem('access_token') ?
                    <Button className="border border-primary p-2 rounded link-underline link-underline-opacity-0" onClick={logout}>Log out</Button> :
                    <Button className="border border-primary p-2 rounded link-underline link-underline-opacity-0" onClick={() => navigate('/login')}>Log in</Button>}
            </div>
        </Navbar>
        <div className="container bg-white border rounded shadow-sm mt-5 p-5">
            {children}
        </div>
    </>;
};

export default ViewContainer;
