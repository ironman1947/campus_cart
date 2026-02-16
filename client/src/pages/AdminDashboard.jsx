import React, { useEffect, useState } from 'react';
import { Container, Table, Tabs, Tab, Alert, Card, Button } from 'react-bootstrap';
import axios from '../utils/api'; // Using the configured axios instance

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await axios.get('/admin/users');
                const productsRes = await axios.get('/admin/products');
                setUsers(usersRes.data);
                setProducts(productsRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This will also delete all their listed products.')) {
            try {
                await axios.delete(`/admin/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
                setProducts(products.filter(product => !product.sellerId || product.sellerId._id !== id));
            } catch (err) {
                console.error(err);
                setError('Failed to delete user');
            }
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/admin/products/${id}`);
                const deletedProduct = products.find(p => p._id === id);
                setProducts(products.filter(product => product._id !== id));

                if (deletedProduct && deletedProduct.sellerId) {
                    setUsers(users.map(user =>
                        user._id === deletedProduct.sellerId._id
                            ? { ...user, productCount: Math.max(0, (user.productCount || 0) - 1) }
                            : user
                    ));
                }
            } catch (err) {
                console.error(err);
                setError('Failed to delete product');
            }
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <h2>Loading Admin Dashboard...</h2>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1 className="mb-4 fw-bold text-gradient">Admin Dashboard</h1>
            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="shadow-sm">
                <Card.Body>
                    <Tabs defaultActiveKey="users" id="admin-tabs" className="mb-3">
                        <Tab eventKey="users" title={`Users (${users.length})`}>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Total Items</th>
                                        <th>Joined At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>
                                                {user.isAdmin ? (
                                                    <span className="badge bg-danger">Admin</span>
                                                ) : (
                                                    <span className="badge bg-primary">User</span>
                                                )}
                                            </td>
                                            <td>{user.productCount || 0}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {!user.isAdmin && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey="products" title={`Products (${products.length})`}>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Seller</th>
                                        <th>Seller Email</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>{product.title}</td>
                                            <td>{product.category}</td>
                                            <td>₹{product.price}</td>
                                            <td>{product.sellerId ? product.sellerId.name : 'Unknown'}</td>
                                            <td>{product.sellerId ? product.sellerId.email : 'Unknown'}</td>
                                            <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminDashboard;
