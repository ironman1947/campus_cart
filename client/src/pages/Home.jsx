import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // If search is empty and category is All, fetch all. 
                // Adjust query params based on backend expectation.
                let query = `/products?`;
                if (search) query += `search=${search}&`;
                if (category !== 'All') query += `category=${category}`;

                const res = await api.get(query);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, category]);

    const categories = ['All', 'Calculator', 'Notes', 'Books', 'Projects', 'Other'];

    return (
        <div>
            <div className="hero-section">
                <Container>
                    <h1 className="fw-bold display-4 mb-3">Buy & Sell on Campus</h1>
                    <p className="lead opacity-75 mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        The safest and easiest way for students to trade books, electronics, and project materials.
                    </p>
                    <div className="search-bar shadow-lg">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="What are you looking for?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Form.Select
                            className="border-0 bg-transparent"
                            style={{ width: '150px', fontWeight: '500', color: 'var(--dark)' }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Form.Select>
                        <Button variant="primary" className="rounded-pill px-4">
                            Search
                        </Button>
                    </div>
                </Container>
            </div>

            <Container className="mb-5" style={{ marginTop: '-4rem' }}>
                <Row xs={1} md={2} lg={4} className="g-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Col key={product._id}>
                                <Card as={Link} to={`/product/${product._id}`} className="text-decoration-none h-100 text-dark border-0 shadow-sm">
                                    <div style={{ position: 'relative' }}>
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:5000/${product.image}`}
                                            style={{ height: '220px', objectFit: 'cover' }}
                                        />
                                        <Badge
                                            bg="light"
                                            text="dark"
                                            className="position-absolute top-0 end-0 m-3 shadow-sm"
                                            style={{ backdropFilter: 'blur(4px)', opacity: 0.9 }}
                                        >
                                            {product.category}
                                        </Badge>
                                    </div>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="text-primary fw-bold mb-0">₹{product.price}</h5>
                                            <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                {new Date(product.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </small>
                                        </div>
                                        <Card.Title className="fw-bold text-truncate" title={product.title}>
                                            {product.title}
                                        </Card.Title>
                                        <Card.Text className="text-muted small text-truncate">
                                            {product.description}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="bg-white border-top-0 pt-0 pb-3">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary fw-bold me-2"
                                                style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                                            >
                                                {product.sellerId?.name?.charAt(0) || 'U'}
                                            </div>
                                            <small className="text-muted text-truncate" style={{ maxWidth: '150px' }}>
                                                {product.sellerId?.name || 'Unknown Seller'}
                                            </small>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12} className="text-center py-5 mt-5">
                            <div className="text-muted mb-4 opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-inbox" viewBox="0 0 16 16">
                                    <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 9h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z" />
                                </svg>
                            </div>
                            <h4 className="text-muted">No items found</h4>
                            <p className="text-muted mb-4">Try adjusting your search or category.</p>
                            <Link to="/add-product" className="btn btn-primary px-4 rounded-pill">
                                Sell an Item
                            </Link>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default Home;
