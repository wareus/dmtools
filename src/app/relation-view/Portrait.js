import React, { Component } from "react";
import { Circle } from "react-konva";
import {SERVER_URL} from "../../index";
import { Route } from 'react-router-dom'

const SIZE = 50;

export default class Portrait extends Component {



    constructor(props)
    {
        super(props)

        console.log(props);

        this.state =
            {
                position: props.position,
                portrait: props.portrait
            }

    }

    state = {
        image: null
    };
    componentDidMount() {
        const image = new window.Image();

        image.src = SERVER_URL + "/images/portraits/" + this.state.portrait + ".jpg";
        image.onload = () => {
            this.setState({
                image: image
            });
        };
    }

    render() {
        return <Route render={({ history}) => (
            <Circle
            x={this.state.position.x}
            y={this.state.position.y}
            fillPatternOffsetX={SIZE}
            fillPatternOffsetY={SIZE}
            radius={SIZE}
            fillPatternImage={this.state.image}
            onClick={()=>{
                history.push('/profile/' + this.state.portrait)
            }}
        />)}/>;
    }
}