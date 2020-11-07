import React from "react"
import { Component } from "react"
import { Market } from "../models"
import { Link } from "react-router-dom"
import { Descriptions, Dropdown, Input, Menu, Tag } from "antd"

export default class MarketDetailItem extends Component<{ market: Market, marketId: string }> {
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
        const menu = (
            <Menu onClick={(e: any) => {
                this.setState((a: { market: Market }) => {
                    a.market.phase = e.key
                    return a
                })
            }}>
                <Menu.Item key="voorbereiding">
                    voorbereiding
              </Menu.Item>
                <Menu.Item key="activatie">
                    activatie
              </Menu.Item>
                <Menu.Item key="wenweken">
                    wenweken
              </Menu.Item>
                <Menu.Item key="wenperiode">
                    wenperiode
              </Menu.Item>
                <Menu.Item key="live">
                    live
              </Menu.Item>
            </Menu>
        );
        return <Descriptions
            key={marketId}>
            <Descriptions.Item label="ID"><b>{marketId}</b></Descriptions.Item>
            <Descriptions.Item label="Markt"><Input
                className={`ant-input${this.state.market.name ? " " : " onbekend"}`}
                id={`market_${marketId}_name`}
                placeholder="Vul naam in"
                onChange={(e: any)=>{
                    this.setState((a: { market: Market }) => {
                        a.market.name= e.target.value
                        return a
                    })
                }}
                value={this.state.market.name} />
            </Descriptions.Item>
            <Descriptions.Item label="Fase">
                <Dropdown.Button className={this.state.market.phase || "onbekend"} overlay={menu}>
                    {this.state.market.phase || "onbekend"}
                </Dropdown.Button>

                {/* <Tag className={market.phase || "onbekend"}>{market.phase || "onbekend"}</Tag> */}
            </Descriptions.Item>
            <Descriptions.Item>
                <a href={`/data/pdf/kaart-${marketId}.pdf`} download>Download Plattegrond</a>
            </Descriptions.Item>
            <Descriptions.Item label="Dagen">

                {
                    Object.keys(this.state.market.events).map((key: string, i: number) => {
                        return <Link key={key} to={{
                            pathname: `/market/detail/${marketId}-${key}`
                        }}>
                            <Tag color="blue" key={key}><span key={key} className="event">{key}</span></Tag>
                        </Link>
                    })
                }
            </Descriptions.Item>
        </Descriptions>
    }
}