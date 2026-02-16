import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Card, Badge, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <Container className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    if (!product) return <Container className="py-5">Product not found</Container>;

    return (
        <Container className="py-5">
            <Row>
                <Col md={6}>
                    <Image
                        src={`http://localhost:5000/${product.image}`}
                        alt={product.title}
                        fluid
                        className="rounded-4 shadow-sm w-100"
                        style={{ objectFit: 'cover', maxHeight: '500px' }}
                    />
                </Col>
                <Col md={6} className="mt-4 mt-md-0">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Badge bg="primary" className="px-3 py-2">{product.category}</Badge>
                        <span className="text-muted">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h1 className="fw-bold mb-3 text-gradient">{product.title}</h1>
                    <h2 className="text-primary mb-4">₹{product.price}</h2>

                    <h5 className="fw-bold">Description</h5>
                    <p className="text-muted mb-4 fs-5" style={{ lineHeight: '1.8' }}>{product.description}</p>

                    <Card className="bg-light border-0 p-4 rounded-4 mt-4">
                        <h5 className="fw-bold mb-3">Seller Information</h5>
                        <div className="d-flex flex-column gap-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Name:</span>
                                <strong>{product.sellerId.name}</strong>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Email:</span>
                                <a href={`mailto:${product.sellerId.email}`} className="text-decoration-none">{product.sellerId.email}</a>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Phone:</span>
                                <a href={`tel:${product.sellerId.phone}`} className="text-decoration-none">{product.sellerId.phone}</a>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetails;
