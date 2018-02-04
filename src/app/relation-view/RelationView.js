import React from "react"
import {fabric} from "fabric"

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {SERVER_URL} from "../../index";

const SIZE = 70;

class RelationView extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            canvas:null
        }


    }

    componentDidMount()
    {

        let canvas = new fabric.Canvas("relationCanvas",  { selection: false });
        fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

        this.setState({canvas});
    }

    render()
    {
        let {character} = this.props.data;

        if(character && this.state.canvas)
        {
            this.drawCanvas(character, this.state.canvas);
        }

        return <canvas id="relationCanvas" width="800" height="800"></canvas>
    }

    async drawCanvas(character, canvas)
    {
        let positions = calcPortraitPositions(character.knows.length + 1);
        let lines = calcLines(positions, character.knows);



        canvas.add(...lines);

        canvas.add (await makePortrait(character.id, positions[0], lines, true));

        lines.forEach(async (line, index)=>{
            canvas.add (await makePortrait(character.knows[index].known.id, positions[index+1], [line], false));
        });

        canvas.on('object:moving', e =>{
            var portrait = e.target;

            if(portrait.middle)
            {
                portrait.lines.forEach(line=>{
                    line.set({'x1': portrait.left, 'y1': portrait.top});
                });
            }else
            {
                portrait.lines.forEach(line=>{
                    line.set({'x2': portrait.left, 'y2': portrait.top});
                });
            }
            canvas.renderAll();
        });

    }
}


    async function makePortrait(id, position, lines, middle)
    {

        return new Promise(resolve => {
        fabric.Image.fromURL(SERVER_URL + "/images/portraits/" + id + ".jpg", function(image) {
            image.scale(1).set({
                left: position.x,
                top: position.y,
                hasControls: false,
                hasBorders: false,
                clipTo: function (ctx) {
                    ctx.arc(0, 0, SIZE, 0, Math.PI * 2, true);
                }

            });
            image.lines = lines;
            image.middle = middle;

            //workaroud for doubleclick
            var timer = 0;
            image.on('mouseup', function() {
                var d = new Date();
                timer = d.getTime();
            });
            image.on('mousedown', function() {
                var d = new Date();
                if ((d.getTime() - timer) < 300) {
                    window.location.href = "/profile/" + id;
                }
            });

            resolve(image);
        })});



    }



    function makeLine(coords, type)
    {
        console.log("type", type);

        if(type === "Enemy")
        {
            return new fabric.Line(coords, {
                stroke: 'red',
                strokeWidth: 5,
                selectable: false
            });
        }
        if(type === "Friend")
        {
            return new fabric.Line(coords, {
                stroke: 'green',
                strokeWidth: 5,
                selectable: false
            });
        }
        if(type === "Married")
        {
            return new fabric.Line(coords, {
                stroke: 'blue',
                strokeWidth: 5,
                selectable: false
            });
        }
        if(type === "Child" || type === "Father" || type === "Mother" || type === "Sibling")
        {
            return new fabric.Line(coords, {
                stroke: 'blue',
                strokeWidth: 5,
                selectable: false,
                strokeDashArray: [10, 5]
            });
        }

        return new fabric.Line(coords, {
            stroke: 'black',
            strokeWidth: 5,
            selectable: false
        });

    }


    function calcPortraitPositions(size)
    {
        let multipier = (size/20)+1
        let radius = 100*multipier;
        let midPosition = {x:400,y:400};

        let positions = [midPosition];

        if(--size > 0)
        {
            for(var i = 0; i<size; i++)
            {
                let rotation = (2*Math.PI/size)*i;


                let x = radius*Math.cos(rotation) - radius*Math.sin(rotation);
                let y = radius*Math.sin(rotation) + radius*Math.cos(rotation);

                positions.push({x:x+ midPosition.x,y:y+ midPosition.y});
            }
        }

        return positions;
    }

    function calcLines(positions, knows)
    {
        let lines = [];

        for(var i = 1; i<positions.length;i++)
        {
            lines.push(makeLine([ positions[0].x, positions[0].y, positions[i].x, positions[i].y ], knows[i-1].type));
        }

        return lines;
    }


export default graphql(gql`
    query RelationQuery($id:Int!) {
        character(id:$id) {
            id
            firstname
            lastname
            knows {
                type
                known{
                    id
                    firstname
                }
            }
        }
    }
`,{
    options:({id})=>{

        return { variables: { id: id } }
    },
})(RelationView);

