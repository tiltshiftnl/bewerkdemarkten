import React from "react"
import { Component } from "react"
import { Market } from "../models"
import { Link } from "react-router-dom"
import { List } from "antd"
import { RightOutlined } from '@ant-design/icons'

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
        return <List.Item.Meta
        avatar={<RightOutlined/>}
            title={<Link key={marketId} to={{
                pathname: `/market/${marketId}`
            }}>{marketId}</Link>}
        description={<>{this.state.market.name || "..."}<br/>Amsterdam</>}/>
    }
}