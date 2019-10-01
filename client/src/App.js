import React, { Fragment } from "react"
import Error from './Error'
import Form from './Form'
import CurrentWeatherCard from './CurrentWeatherCard'
import ForecastCard from './ForecastCard';
import { Paper } from "@material-ui/core";
import { Container, Row, Col } from "react-bootstrap";
import axios from 'axios';


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: undefined,
      currentWeather: undefined,
      forecast: undefined
    };
  }

  onWeatherSubmit = (city) => {
    if (!city) {
      return;
    }

    axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `query($placeId: String!) {
          weather(placeId: $placeId) {
            temp
            humidity
            name
            mapKey
            coord {
              lat
              lon
            }
            weather {
              icon
              description
            }
            wind {
              speed
              deg
            }
          }
          forecast(placeId: $placeId) {
            temp
            humidity
            time
            weather {
              icon
              description
            }
          }
        }`,
        variables: {
          placeId: city.placeid
        }
      }
    }).then((res) => {
      this.setState({ currentWeather: res.data.data.weather, forecast: res.data.data.forecast, errors: res.data.errors });
    }).catch((err) => {
      console.error(err);
    })
  }

  renderWeather(currentWeather, forecast) {
    if (currentWeather) {
      return (
        <Row>
          <Col sm={6}>
            <CurrentWeatherCard weather={currentWeather} mapApiKey={currentWeather.mapKey} />
          </Col>
          <Col sm={6} >
            <Row>
              {this.renderForecast(forecast)}
            </Row>
          </Col>
        </Row>
      )
    }
    else {
      return null;
    }
  }

  renderForecast(forecast) {
    if (forecast) {
      return (
        <Fragment>
          {forecast.map((f, index) => {
            return (
              <ForecastCard weather={f} key={index} />
            )
          })}
        </Fragment>
      )
    }
    return null;
  }


  render() {
    return (
      <div>
        <Container >
          <img width="100px" alt="logo" src="data:image/png;base64,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" />
          <h1 style={{ display: "inline" }}>Weather with React &amp; GraphQL</h1>
          <Paper style={{ padding: 10 }}>
            <Form onaction={this.onWeatherSubmit} />
            <Error errors={this.state.errors} />
            {this.renderWeather(this.state.currentWeather, this.state.forecast)}
          </Paper>
        </Container>
      </div>
    );
  }
}
