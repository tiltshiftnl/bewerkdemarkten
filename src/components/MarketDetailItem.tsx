import React from "react"
import { Component } from "react"
import { Market } from "../models"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Button, Descriptions, Dropdown, Input, Menu, Tag, Tooltip } from "antd"
import { PlusOutlined } from '@ant-design/icons'

interface MarketDetailItemProps extends RouteComponentProps {
    market: Market, marketId: string
}

class MarketDetailItem extends Component<MarketDetailItemProps> {
    history: any
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


    handleClose = (removedTag: any) => {
        //const tags = this.state.tags.filter(tag => tag !== removedTag)
        console.log(removedTag)
        //this.setState({ tags })
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
                onChange={(e: any) => {
                    this.setState((a: { market: Market }) => {
                        a.market.name = e.target.value
                        return a
                    })
                }}
                value={this.state.market.name} />
            </Descriptions.Item>
            <Descriptions.Item label="Fase">
                <Dropdown.Button className={this.state.market.phase || "onbekend"} overlay={menu}>
                    {this.state.market.phase || "onbekend"}
                </Dropdown.Button>
            </Descriptions.Item>
            {this.state.market.plan &&
                <Descriptions.Item>
                    <a href={`/data/pdf/${this.state.market.plan.name}.pdf`} download>Download Plattegrond</a>
                </Descriptions.Item>}
            <Descriptions.Item label="Dagen">

                {
                    Object.keys(this.state.market.events).map((key: string, i: number) => {
                        return <Tag
                            onClick={() => this.props.history.push({ pathname: `/market/detail/${marketId}-${key}` })}
                            onClose={() => this.handleClose(key)}
                            color="blue"
                            key={key}
                            closable={true}>
                            <span key={key} className="event">{key}</span>
                        </Tag>
                    })
                }
                <Tooltip title="Dag toevoegen">
                    <Button type="primary" shape="circle" icon={<PlusOutlined />} />
                </Tooltip>
            </Descriptions.Item>
        </Descriptions>
    }
}

export default withRouter(MarketDetailItem)