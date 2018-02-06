import React from "react"
import {graphql} from "react-apollo/index";
import gql from "graphql-tag";
import {Button} from "primereact/components/button/Button";
import {InputText} from "primereact/components/inputtext/InputText";
import {RadioButton} from "primereact/components/radiobutton/RadioButton";
import {Accordion,AccordionTab} from 'primereact/components/accordion/Accordion';

class AddCharacterPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            character:{
                firstname:"",
                lastname:"",
                nickname:"",
                gender:null
            }
        };

        this.onGenderChange = this.onGenderChange.bind(this);
    }

    onGenderChange(e)
    {
        let character = this.state.character;
        character.gender = e.value
        this.setState(character);
    }

    render()
    {
        return(
            <Accordion>
                <AccordionTab header={"Add character"}>
                        Firstname:
                        <InputText onChange={(e) => {
                            let character = this.state.character;
                            character.firstname = e.target.value
                            this.setState(character);
                        }}/>
                        Lastname:
                        <InputText onChange={(e) => {
                            let character = this.state.character;
                            character.lastname = e.target.value
                            this.setState(character);
                        }}/>
                        Nickname:
                        <InputText onChange={(e) => {
                            let character = this.state.character;
                            character.nickname = e.target.value
                            this.setState(character);
                        }}/>

                        Gender:
                        <RadioButton value="Male" onChange={this.onGenderChange} checked={this.state.character.gender==="Male"} />
                        Male
                        <RadioButton value="Female" onChange={this.onGenderChange} checked={this.state.character.gender==="Female"} />
                        Female

                        <Button label={"add"} onClick={async ()=> {
                            this.props.add({variables:this.state.character});
                            this.props.refetch();
                        }}/>

                </AccordionTab>
            </Accordion>);
    }


}

export default graphql(gql`
    mutation addCharacter($id:Int, $firstname:String, $lastname:String, $nickname:String){
        addCharacter(id:$id, firstname:$firstname, lastname:$lastname, nickname:$nickname)
        {
            id
        }
    }
`, {name:"add"})(AddCharacterPanel);