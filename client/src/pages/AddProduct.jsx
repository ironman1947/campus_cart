import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Calculator'
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { title, description, price, category } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onFileChange = e => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const onSubmit = async e => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', title);
        data.append('description', description);
        data.append('price', price);
        data.append('category', category);
        data.append('image', image);

        try {
            await api.post('/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Error adding product');
        }
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4 fw-bold text-gradient">Sell an Item</h2>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <Card className="p-4 shadow-sm border-0">
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={onSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={category}
                                    onChange={onChange}
                                >
                                    <option value="Calculator">Calculator</option>
                                    <option value="Notes">Notes</option>
                                    <option value="Books">Books</option>
                                    <option value="Projects">Projects</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Price (₹)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={price}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={description}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Product Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileChange}
                                    required
                                />
                                {preview && (
                                    <div className="mt-3">
                                        <img src={preview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
                                    </div>
                                )}
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                List Item
                            </Button>
                        </Form>
                    </Card>
                </div>
            </div>
        </Container>
    );
};

export default AddProduct;
