import React from "react";
import { Card, CardHeader, CardContent, Avatar, Typography } from "@material-ui/core";

export default class ForecastCard extends React.Component {

    render() {
        const { weather } = this.props;
        if (weather) {
            return (
                <Card raised style={{ width: 180, maxWidth: 180, marginBottom: 6, marginRight: 6 }}>
                    <CardHeader
                        title={weather.time}
                        subheader={
                            <Typography variant="body2">{weather.temp}  &deg;c</Typography>
                        }
                        avatar={
                            <Avatar src={"https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"} />
                        } />
                    <CardContent>
                        {weather.weather.map((val, index) => {
                            return (
                                <Typography key={index}>
                                    {val.description}
                                </Typography>);
                        })}
                    </CardContent>
                </Card>
            );
        }
        else {
            return null;
        }
    }
}