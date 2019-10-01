"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const rp = require('request-promise-native');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const uuidv4 = require('uuid/v4');
const graphqlHTTP = require('express-graphql');
const graphql_1 = require("graphql");
const app = express();
const port = process.env.PORT || 8080;
let googleSessionId;
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'client/public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'client/build')));
const google_api_key = process.env['google_maps_api_key'];
const google_api_key_client = process.env['google_maps_api_key_client'];
const apikey = process.env['weather_api_key'];
async function init() {
    setInterval(() => {
        googleSessionId = uuidv4();
    }, 5000);
}
const schema = graphql_1.buildSchema(`
    type City {
        description: String
        placeId: String
    }
    type Weather {
        icon: String
        description: String
    }
    type Wind {
        deg: Float
        speed: Float
    }
    type GeoLocation {
        lat: Float
        lon: Float
    }
    type CurrentWeather {
        name: String
        coord: GeoLocation
        temp: Float
        humidity: Float
        weather: [Weather]
        wind: Wind
        mapKey: String
    }    
    type Forecast {
        temp: Float
        humidity: Float
        time: String
        weather: [Weather]
    }
    type Query {
        city(prefix: String!): [City]
        weather(placeId: String!): CurrentWeather
        forecast(placeId: String!, cnt: Int = 40): [Forecast]        
    }
`);
const root = {
    city: async (params) => {
        const result = await rp({
            uri: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${google_api_key}&input=${params.prefix}&sessionToken=${googleSessionId}&types=(cities)`,
            json: true
        });
        const predictions = result.predictions.map((p) => {
            return { description: p.description, placeId: p.place_id };
        });
        return predictions;
    },
    weather: async (params) => {
        const placeDetails = await rp({
            uri: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${params.placeId}&key=${google_api_key}`,
            json: true
        });
        const currentWeather = await rp({
            uri: `https://api.openweathermap.org/data/2.5/weather?lat=${placeDetails.result.geometry.location.lat}&lon=${placeDetails.result.geometry.location.lng}&appid=${apikey}&units=metric`,
            json: true
        });
        return {
            temp: currentWeather.main.temp,
            name: currentWeather.name,
            humidity: currentWeather.main.humidity,
            weather: currentWeather.weather,
            wind: currentWeather.wind,
            mapKey: google_api_key_client,
            coord: currentWeather.coord
        };
    },
    forecast: async (params) => {
        const placeDetails = await rp({
            uri: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${params.placeId}&key=${google_api_key}`,
            json: true
        });
        const result = await rp({
            uri: `https://api.openweathermap.org/data/2.5/forecast?lat=${placeDetails.result.geometry.location.lat}&lon=${placeDetails.result.geometry.location.lng}&appid=${apikey}&units=metric&cnt=${params.cnt}`,
            json: true
        });
        return result.list.map((f) => {
            return {
                temp: f.main.temp,
                humidity: f.main.humidity,
                time: f.dt_txt,
                weather: f.weather
            };
        });
    }
};
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
app.listen(port, async () => {
    await init();
    console.log(`Example app listening on port - ${port}!`);
});
//# sourceMappingURL=app.js.map