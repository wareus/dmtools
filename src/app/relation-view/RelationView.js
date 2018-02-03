import React from "react"
import { Stage, Layer, Line } from "react-konva";
import Portrait from "./Portrait"

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const RelationView = function({data:{character}})
    {

        if(character === undefined) return(<div></div>);

        let positions = calcPortraitPositions(character.knows.length +1);
        let linePositions = calcLinePositions(positions);


        return(
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Line
                        points={linePositions}
                        stroke= {"black"}
                    />
                </Layer>
                <Layer>
                    {positions.map((position,index)=>{

                        let portrait = index === 0 ? character.id : character.knows[index-1].known.id;
                        return <Portrait key={index} position={position} portrait={portrait}/>
                    })}
                </Layer>
            </Stage>
        );
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

    function calcLinePositions(positions)
    {
        let linePositions = [];

        for(var i = 1; i<positions.length;i++)
        {
            linePositions.push(positions[0].x);
            linePositions.push(positions[0].y);
            linePositions.push(positions[i].x);
            linePositions.push(positions[i].y);
        }

        return linePositions;
    }


export default graphql(gql`
    query RelationQuery($id:Int!) {
        character(id:$id) {
            id
            firstname
            lastname
            knows {
                known{
                    id
                    firstname
                }
                level
            }
        }
    }
`,{
    options:({id})=>{

        return { variables: { id: id } }
    },
})(RelationView);

