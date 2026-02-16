import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                const res = await api.get('/products/myproducts');
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                setMessage({ type: 'danger', text: 'Failed to load your listings' });
            }
        };
        fetchMyProducts();
    }, []);

    const deleteProduct = async (id) => {
        const product = products.find(p => p._id === id);
        const confirmMessage = `Are you sure you want to delete "${product?.title}"?\n\nThis item will be permanently removed and cannot be undone.`;

        if (window.confirm(confirmMessage)) {
            setDeleting(id);
            setMessage({ type: '', text: '' });
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
                setMessage({ type: 'success', text: 'Item deleted successfully!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (err) {
                console.error(err);
                setMessage({ type: 'danger', text: err.response?.data?.msg || 'Failed to delete item. Please try again.' });
            } finally {
                setDeleting(null);
            }
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <Container className="py-5">
            {/* Header Section */}
            <div className="mb-5 text-center">
                <div className="d-inline-block bg-primary text-white rounded-circle p-3 mb-3 fs-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="fw-bold text-gradient">{user?.name || 'User'}</h2>
                <p className="text-muted mb-4">{user?.email} | {user?.phone}</p>

                {/* Stats Cards */}
                <Row className="mb-4">
                    <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body>
                                <h3 className="text-primary fw-bold mb-0">{products.length}</h3>
                                <small className="text-muted">Active Listings</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body>
                                <h3 className="text-success fw-bold mb-0">₹{products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)}</h3>
                                <small className="text-muted">Total Value</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body>
                                <Link to="/add-product" className="text-decoration-none">
                                    <Button variant="primary" size="sm" className="w-100">
                                        + Add New Item
                                    </Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Messages */}
            {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}

            {/* My Listings Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">My Dashboard</h3>
                <Badge bg="secondary">{products.length} {products.length === 1 ? 'item' : 'items'}</Badge>
            </div>

            {products.length === 0 ? (
                <Alert variant="info" className="text-center">
                    <h5>You haven't listed any items yet.</h5>
                    <p className="mb-0">Start selling by adding your first item!</p>
                    <Link to="/add-product">
                        <Button variant="primary" className="mt-3">Add Your First Item</Button>
                    </Link>
                </Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {products.map((product) => (
                        <Col key={product._id}>
                            <Card className="h-100 border-0 shadow-sm position-relative">
                                <Card.Img
                                    variant="top"
                                    src={`http://localhost:5000/${product.image}`}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Badge bg="light" text="dark">{product.category}</Badge>
                                        <h5 className="text-primary mb-0 fw-bold">₹{product.price}</h5>
                                    </div>
                                    <Card.Title className="mb-2" style={{ fontSize: '1.1rem' }}>
                                        {product.title}
                                    </Card.Title>
                                    <Card.Text className="text-muted small flex-grow-1" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {product.description}
                                    </Card.Text>
                                    <div className="mt-auto pt-3">
                                        <small className="text-muted d-block mb-2">
                                            Listed on {new Date(product.createdAt).toLocaleDateString()}
                                        </small>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="w-100"
                                            onClick={() => deleteProduct(product._id)}
                                            disabled={deleting === product._id}
                                        >
                                            {deleting === product._id ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                'Delete Item'
                                            )}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Profile;
