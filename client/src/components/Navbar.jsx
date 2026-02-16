import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar expand="lg" className="navbar sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/">CampusCart</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Debug: {JSON.stringify(user?.email)} */}
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/">Marketplace</Nav.Link>
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/add-product">Sell Item</Nav.Link>
                                <Nav.Link as={Link} to="/profile">Dashboard</Nav.Link>
                                {user?.isAdmin && (
                                    <Nav.Link as={Link} to="/admin" className="text-danger fw-bold">Admin Panel</Nav.Link>
                                )}
                                <div className="vr mx-3 d-none d-lg-block opacity-25"></div>
                                <span className="navbar-text me-3 fw-bold text-gradient">
                                    Hello, {user?.name ? user.name.split(' ')[0] : 'User'}
                                </span>
                                <Button variant="outline-danger" size="sm" onClick={onLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Button as={Link} to="/register" variant="primary" className="ms-2">Get Started</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
