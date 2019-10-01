import React from "react"
import Button from "@material-ui/core/Button";
import { Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import axios from 'axios';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cities: []
        }
    }

    onCityNameChanged = (text) => {

        axios({
            url: '/graphql',
            method: 'post',
            data: {
                query: `query {
                city(prefix: "${text}") {
                  description
                  placeId
                }
              }`
            }
        }).then((res) => {
            var cities = res.data.data.city.map(c => {
                return { label: c.description, placeid: c.placeId }
            })
            this.setState({
                cities: cities
            })
        }).catch((err) => {
            console.error(err);
        });
    }

    onChange = (t) => {
        this.setState({
            selectedCity: t[0]
        })
    }

    onSubmit = (event) => {
        this.props.onaction(this.state.selectedCity)
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div style={{ paddingBottom: 10, paddingTop: 10 }}>
                    <Typeahead id={"1"} options={this.state.cities} renderMenu={(results, menuProps) => (
                        <Menu {...menuProps}>
                            {results.map((result, index) => (
                                <MenuItem key={index} option={result} position={index}>
                                    {result.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    )} onInputChange={this.onCityNameChanged} onChange={this.onChange} onKeyDown={this.handleKeyboard} />
                    <Button type="submit" style={{ height: 40, marginTop: 10 }} color="primary" variant="contained" onClick={this.onsubmit}>Search Weather</Button>
                </div>
            </form>
        )
    }
}