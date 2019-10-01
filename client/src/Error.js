import React from "react";

export default class Error extends React.Component {

    render() {
        if (this.props.errors) {
            return (
                this.props.errors.map((e) => {
                    return (
                        <div className="alert alert-danger" role="alert">
                            Error: {e.message}
                        </div>
                    );
                })
            )
        }
        else {
            return null;
        }
    }
}