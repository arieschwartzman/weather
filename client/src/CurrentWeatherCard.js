import React from "react"
import Card from '@material-ui/core/Card';
import { Avatar, CardHeader, CardContent, Typography, CardMedia, CardActions } from "@material-ui/core";
import Slider from "@material-ui/lab/Slider";

export default class CurrentWeatherCard extends React.Component {
    state = {
        zoom: 11
    }

    updateZoom = (evt, value) => {
        this.setState({ zoom: value });
    }

    render() {
        if (this.props.weather) {

            const { weather } = this.props;

            return (
                <Card raised style={{ maxWidth: 600 }}>
                    <CardHeader
                        avatar={
                            <Avatar src={"https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"}>
                            </Avatar>
                        }
                        title={weather.name}
                        subheader={weather.weather[0].description}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary">
                            <b>Temprature:</b> {weather.temp} &deg;c
                    </Typography>
                        <Typography variant="body2" color="textSecondary">
                            <b>Wind Speed:</b> {weather.wind.speed} km/h
                    </Typography>
                        <Typography variant="body2" color="textSecondary">
                            <b>Humidity:</b> {weather.humidity}%
                    </Typography>

                        <CardMedia
                            component="img"
                            image={"https://maps.googleapis.com/maps/api/staticmap?center=" + weather.coord.lat + "," + weather.coord.lon +
                                "&zoom=" + this.state.zoom + "&size=600x400&key=" + this.props.mapApiKey} />
                        <CardActions>
                            <Slider value={this.state.zoom} min={4} max={15} step={1} onChange={this.updateZoom}>Zoom</Slider>
                        </CardActions>
                    </CardContent>
                </Card>
            );
        }
        else {
            return null;
        }
    }
}