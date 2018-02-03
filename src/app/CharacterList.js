import React from "react";
import { Route } from 'react-router-dom'

import {DataGrid} from 'primereact/components/datagrid/DataGrid';
import {Panel} from "primereact/components/panel/Panel";
import {SERVER_URL} from "../index";
import {graphql} from "react-apollo/index";
import gql from "graphql-tag";


class CharacterList extends React.Component
{
    characterTemplate(character) {
        if(!character) {
            return;
        }

        var src = SERVER_URL + "/images/portraits/" + character.id + ".jpg";

        return (
            <Route render={({ history}) => (
            <div style={{ padding: '3px' }} className="ui-g-12 ui-md-3" onClick={()=>history.push('/profile/' + character.id)}>
                <Panel header={character.firstname + " " + character.lastname} style={{ textAlign: 'center' }}>
                    <img src={src} alt={character.firstname} />
                    <div>{character.nickname}</div>
                </Panel>
            </div>
            )}/>);
    }

    render()
    {
        let { loading, characters, error } = this.props.data;
        if (loading) return <div>Loading</div>;
        if (error) return <h1>ERROR</h1>;

        return <DataGrid value={characters} itemTemplate={this.characterTemplate.bind(this)} header="Characters"></DataGrid>;
    }

}

export default graphql(gql`
    query CHaractersQuery{
        characters {
            id
            firstname
            lastname
            nickname
        }
    }
`)(CharacterList);

