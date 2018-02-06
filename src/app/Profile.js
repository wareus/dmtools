import React from "react";
import {graphql} from "react-apollo/index";
import gql from "graphql-tag";
import {SERVER_URL} from "../index";
import {Sidebar} from 'primereact/components/sidebar/Sidebar';
import {Button} from "primereact/components/button/Button";
import RelationView from "./relation-view/RelationView"

class Profile extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            sidebarVisible:false
        }


    }

    render()
    {
        let { loading, character, error } = this.props.data;
        if (loading) return <div>Loading</div>;
        if (error) return <h1>ERROR</h1>;


        character = character === undefined? {}:character;

        return(<div>


            <Sidebar visible={this.state.sidebarVisible} onHide={ () => this.setState({sidebarVisible:false}) }>
                <img src={SERVER_URL + "/images/portraits/" + character.id + ".jpg"} alt={character.nickname}/>
                <h3>{character.nickname}</h3>

                <ul>
                    <li>name: {character.firstname} {character.lastname}</li>
                    <li>nickname: {character.nickname}</li>
                    <li>gender: {character.gender}</li>
                </ul>
                <ul>
                    {character.events.map(event=><li>{event.date}: {event.type}</li>)}
                </ul>

            </Sidebar>

            <Button icon="fa-arrow-right" onClick={ () => this.setState({sidebarVisible:true}) }/>

            <RelationView id={character.id}/>
        </div>);
    }
}

export default graphql(gql`
    query ProfileQuery ($id:Int!){
        character(id:$id) {
            id
            firstname
            lastname
            nickname
            gender
            events{
                type
                date
            }
        }
    }
`, {
    options: ({location: {pathname}}) => {

        let pathParam = pathname.split("/").slice(-1).pop();

        return {variables: {id: pathParam}}
    },
})(Profile);