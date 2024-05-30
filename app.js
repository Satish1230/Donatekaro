const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Listing = require('./models/listing');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const mongo_url = 'mongodb://127.0.0.1:27017/donatekaro'
main().then(() => console.log('MongoDB is connected'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongo_url)
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    res.send("Welcome")

});

//  index route
app.get('/listings', async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
});

// new route
app.get('/listings/new', (req, res) => {
    res.render("listings/new.ejs");
});

// show route
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//create route
app.post('/listings', async (req, res) => {
    // let { title, description, price, location, country } = req.body;
    const newlisting = new Listing(req.body.listing)
    const listing = await newlisting.save();
    res.redirect("/listings");

});

// edit route
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;             //this line and the next line find the listing by id
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// update route
app.put('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
})

// delete route
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// app.get('/listings', async (req, res) => {
//     let sample_listing = new Listing({
//         title: 'phone',
//         description: 'good',
//         // image: 'https://unsplash.com/photos/a-view-of-a-building-through-a-window-Yah6XOGrMxQ',
//         price: 40000,
//         location: 'India',
//         country: 'India',
//     });
//     await sample_listing.save();
//     console.log('Listing saved');
//     res.send("Successful testing");
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});