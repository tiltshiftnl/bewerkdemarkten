import React from "react"
import { Component } from "react"
import { Market } from "../models"
import { Link } from "react-router-dom"


export default class MarketListItem extends Component<{ market: Market, marketId: string }> {
    readonly state: { market: Market } = {
        market: {
            name: "onbekend",
            id: 0,
            events: {}
        }
    }

    componentDidMount() {
        this.setState({
            market: this.props.market
        })
    }

    render() {
        const { marketId } = this.props
        return <>
            <Link key={marketId} to={{
                pathname: `/market/${marketId}`
            }}>{marketId} {this.state.market.name}
            </Link>
        </>
    }
}