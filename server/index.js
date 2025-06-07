let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let app = express();
let ProductRoute = require('./routes/product.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/shop', ProductRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the Shop API');
});

mongoose.connect('mongodb+srv://nersdev:Hadi2017g@shop.mlv095c.mongodb.net/?retryWrites=true&w=majority&appName=shop')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

module.exports = app;