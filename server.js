// configure the root of the website, pages, etc, start the server

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
//Defining port in order for Heroku to work correctly


var app = express();
//make a new express app

hbs.registerPartials(__dirname + '/views/partials');
//Adding support for patials: reusable code for html views, pass through the files that holds the partials
//ex. our footer.hbs file in our partials folder

app.set('view engine','hbs')
//Allows use to set some express configurations
//Here we set the view engine to hbs



app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}; ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.')
        }
    })
    next();
});
//'next' exists so we can tell express when the middle ware function is done
//anything that comes from the client is in the 'req' (request) object

// app.use((req, res) => {
//     res.render ('maintenance.hbs')
// });


app.use(express.static(__dirname + '/public'));
//middleware lets you configure how your express app works, and add on to express
//Just provide the middleware function we want to use


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text) => {
    return text.toUpperCase();
})
//Ways to register functions to run to dynamically create output
//First argument: name of the function 
//Second argument: the actual function


app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Hello, welcome to the home page!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
    //.render() lets you set up any templates set up with our current view engine (hbs)
})

//app.get: Setting up a handler for an http.get request
//The first srgument is the url, 
//The second argument is the callback function that tells express what to send back once the person has made the request

//the arguments for the function are request and response:
// request: Stores a lot of information about the request coming in (headers, body info, method made with the request )
// response: Contains a ton of methods to deal with the response in any way I'd like
//Setting up all of the http route handlers


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
//Binds the application to a port on our machine
//Access localhost:3000 in our browser to access the app
//port is whichever port Heroku uses to host our app on