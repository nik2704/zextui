import React from "react";

export class AppSimpleHeader extends React.Component {
    render() {
        return (
            <h1 className="ui header">{this.props.title}</h1>
        )
    }
}
