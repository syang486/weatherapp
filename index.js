//Require application denpendencies
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

//Configure .env package
require('dotenv').config();

const apiKey = '49b6f18e18908323f9e339adb09e068d';

app.use(express.static(__dirname + "../public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index", {weather: null, error: null});
});


app.post('/', function(req, res){
    let {city, country} = req.body;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`;

    request(url, function(err, response, body){
        
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else{
            let weather = JSON.parse(body);
            console.log(weather);
            if(!weather.main){
                res.render('index', {weather: null, error: 'Error, please enter valid city name or country code.'});
            }else{
                let lat = `${weather.coord.lat}, ${weather.coord.lon}`;
                let description = `${weather.weather[0].main}, ${weather.weather[0].description}`;
                let temp_c = `${weather.main.temp}`, feels_like_c = `${weather.main.feels_like}`;
                let temp_min_c = `${weather.main.temp_min}`, temp_max_c = `${weather.main.temp_max}`;
                let pressure = `${weather.main.pressure}`, humidity = `${weather.main.humidity}`;
                let wind_speed = `${weather.wind.speed}`, wind_deg = `${weather.wind.deg}`;
                let cloud = `${weather.clouds.all}`, visibility = `${weather.visibility}`;
                let name = `${weather.name}, ${weather.sys.country}`; 

                function ctof(c){
                    var f = (c * 9)/5 + 32;
                    return Math.round((f + Number.EPSILON)*100)/100;
                }

                let temp_f = ctof(temp_c), feels_like_f = ctof(feels_like_c), temp_min_f = ctof(temp_min_c), temp_max_f = ctof(temp_max_c);
                res.render("index", {weather: weather,
                                     lat: lat,
                                     description: description,
                                     temp_c: temp_c, feels_like_c: feels_like_c,
                                     temp_min_c: temp_min_c, temp_max_c: temp_max_c,
                                     temp_f: temp_f, feels_like_f: feels_like_f,
                                     temp_max_f: temp_max_f, temp_min_f: temp_min_f,
                                     pressure: pressure,
                                     humidity: humidity,
                                     visibility: visibility,
                                     wind_speed: wind_speed, wind_deg: wind_deg,
                                     cloud: cloud,
                                     name: name,
                                     error: null,});
            }
        }
    });
});

app.listen(8080, () =>{
    console.log('Application listening on port 8080');
});