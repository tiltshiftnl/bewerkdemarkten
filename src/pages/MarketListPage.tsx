import { ImEmbed2, ImFileEmpty } from "react-icons/im"
import { Button } from "@amsterdam/asc-ui"
import React, { Component } from "react"
import { Market, Markets } from "../models"
import MarketsService from "../services/service_markets"
import { Link } from "react-router-dom"

export default class MarketListPage extends Component {

    readonly state: { markets: Markets } = {
        markets: {}
    }

    marketsService: MarketsService


    constructor(props: any) {
        super(props)
        this.marketsService = new MarketsService()
    }

    componentDidMount = () => {
        this.marketsService.retrieve().then((markets: Markets) => {
            this.setState({
                markets
            })
        })
    }

    render() {
        const IconSize = 20;

        return <>
            <table>
                <thead>
                    <tr>
                        <th>Markten <small>uit Mercato</small></th>
                        <th></th>
                        <th>Marktdagen/evenementen</th>
                        <th>Fase</th>
                        {/* <th>Actie</th> */}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(this.state.markets).map((key: string, i: number) => {
                        const market: Market = this.state.markets[key]
                        const marketid: string = key
                        return <tr key={key}>
                            <td>
                                {key}
                            </td>
                            <td>{market.name}</td>
                            <td>
                                {
                                Object.keys(market.events).map((key: string, i: number) => {
                                    return <span key={key} className="event"><Link to={{
                                        pathname: `/market/${marketid}-${key}`
                                    }}>{key}</Link></span>
                                })
                                }
                            </td>
                            <td>{market.phase}</td>
                            {/* <td><MarketActions market={market} /></td> */}
                        </tr>
                    })}
                </tbody>
            </table>
            <Button title="Nieuwe leeg" variant="primaryInverted" iconSize={IconSize} iconLeft={<ImFileEmpty />}>Nieuwe leeg</Button>
            <Button title="Aanpassen bronbestand markten" variant="primary" iconSize={IconSize} iconLeft={<ImEmbed2 />}>Aanpassen bronbestand markten</Button>
        </>

    }
}