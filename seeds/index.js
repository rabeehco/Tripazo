const mongoose = require('mongoose')
const cities = require('./cities')
const {authors, images} = require('./authors')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')
mongoose.connect('mongodb://127.0.0.1:/yelp-camp')
.then(()=>{
    console.log('DB connected')
})

// const sample = array => { // When I code this I got 'undefined' in title field on mongodb
//     array[Math.floor(Math.random() * array.length)] 
// }

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0, j=0; j<=7,i<300; j++,i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const random8 = Math.floor(Math.random() * 8);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: `${authors[j].author}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: images[j].url,
                  filename: images[j].filename
                }
              ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, repellendus. Neque iste qui ratione omnis facilis similique cumque, ipsum sunt quis commodi excepturi accusamus nobis, eius nisi vitae corporis iure.',
            price,
            geometry: {
                "type": "Point",
                "coordinates": [
                    cities[random1000].longitude,
                    cities[random1000].latitude,                
                ]
            } 
        })
        await camp.save()
        if(j==7){
            j=-1;
        }
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})    