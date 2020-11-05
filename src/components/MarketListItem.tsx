import React from "react"
import { Component } from "react"
import { Market } from "../models"
import { Link } from "react-router-dom"
import { Descriptions, Tag } from "antd"

export default class MarketListItem extends Component<{ market: Market, marketId: string }> {
    render() {
        const { market, marketId } = this.props
        const marketid: string = marketId
        return <Descriptions
            key={marketId}
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
            <Descriptions.Item label="ID"><b>{marketId}</b></Descriptions.Item>
            <Descriptions.Item label="Markt"><em>{market.name || "onbekend"}</em></Descriptions.Item>
            <Descriptions.Item label="Fase"><Tag className={market.phase || "onbekend"}>{market.phase || "onbekend"}</Tag></Descriptions.Item>
            <Descriptions.Item label="Dagen">

                {
                    Object.keys(market.events).map((key: string, i: number) => {
                        return <Link key={key} to={{
                            pathname: `/market/${marketid}-${key}`
                        }}>
                            <Tag color="blue" key={key}><span key={key} className="event">{key}</span></Tag>
                        </Link>
                    })
                }
            </Descriptions.Item>
        </Descriptions>
    }
}