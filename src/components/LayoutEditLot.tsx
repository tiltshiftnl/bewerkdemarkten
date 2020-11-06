import React, { Component } from "react"

export default class LayoutEditLot extends Component<{
    lot: string
    branches: string[]
    facilities: string[]
    properties: string[]
}> {
    render() {
        const { lot, branches, facilities, properties } = this.props
        return <>
            <div>{lot}</div>
            {branches.length > 0 && <>
                Verkoopinformatie
        <ul>
                    {branches.map((name, i) => {
                        return <li>{name}</li>
                    }
                    )}
                </ul>
            </>}
            {facilities.length > 0 && <>
                Faciliteiten
        <ul>
                    {facilities.map((name, i) => {
                        return <li>{name}</li>
                    }
                    )}
                </ul>
            </>}
            {properties.length > 0 && <>
                Extra's
        <ul>
                    {properties.map((name, i) => {
                        return <li>{name}</li>
                    }
                    )}
                </ul>
            </>}
        </>
    }
}