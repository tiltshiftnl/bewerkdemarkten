import React, { Component } from "react"
import { Lot } from "../models"

export default class LayoutEditLot extends Component<{
    lot: Lot
}> {
    render() {
        const { lot } = this.props
        return <>
            <div>{lot.plaatsId}</div>
            {lot.branches && lot.branches.length > 0 && <>
                Branches
                <ul>
                    {lot.branches.map((name, i) => {
                        return <li>{name}</li>
                    }
                    )}
                </ul>
            </>}
            {lot.verkoopinrichting && lot.verkoopinrichting.length > 0 && <>
                Verkoopinrichting
                <ul>
                    {lot.verkoopinrichting.map((name, i) => {
                        return <li>{name}</li>
                    }
                    )}
                </ul>
            </>}
            {lot.properties && lot.properties.length > 0 && <>
                Properties
                <ul>
                    {lot.properties.map((name, i) => {
                        return <li>{name}</li>
                    }
                    )}
                </ul>
            </>}
        </>
    }
}