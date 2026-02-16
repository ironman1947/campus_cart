const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});

        const users = await User.create([
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                password: 'password123', 
                phone: '1234567890'
            },
            {
                name: 'Bob Smith',
                email: 'bob@example.com',
                password: 'password123',
                phone: '0987654321'
            },
            {
                name: 'Admin User',
                email: 'admin@campuscart.com',
                password: 'admin@123',
                phone: '0000000000',
                isAdmin: true
            }
        ]);

        // Re-fetch users to get their IDs and ensure correct hashing (actually creation triggers hooks)
        const [user1, user2] = users;

        // Create Products
        const products = [
            {
                title: 'Casio fx-991EX Scientific Calculator',
                description: 'Used for 1 semester. Excellent condition. rigorous usage.',
                price: 850,
                category: 'Calculator',
                image: 'uploads/sample_calculator.jpg',
                sellerId: user1._id
            },
            {
                title: 'Engineering Physics Notes - Sem 1',
                description: 'Complete handwritten notes for Engineering Physics. Includes solved numbers.',
                price: 200,
                category: 'Notes',
                image: 'uploads/sample_notes.jpg',
                sellerId: user2._id
            },
            {
                title: 'Introduction to Algorithms (CLRS)',
                description: 'Hardcover 3rd Edition. A bit distinct but pages are clean.',
                price: 1200,
                category: 'Books',
                image: 'uploads/sample_book.jpg',
                sellerId: user1._id
            },
            {
                title: 'Arduino Starter Kit Project',
                description: 'Includes Arduino Uno, breadboard, jumper wires, and sensors. Good for mini projects.',
                price: 1500,
                category: 'Projects',
                image: 'uploads/sample_arduino.jpg',
                sellerId: user2._id
            }
        ];

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
