import React from "react";
import {Menubar} from 'primereact/components/menubar/Menubar';

const Header = function()
{
    var items=[
        {
            label: "Characters",
            icon: "fa-male",
            url:"/"
        }
    ];

    return(<Menubar model={items}/>)
}

export default Header;

