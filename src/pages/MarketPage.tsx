import React, { ChangeEvent, Component } from "react"
import { Market, Markets, Events } from "../models"
import MarketsService from "../services/service_markets"
import { Breadcrumb, Button, Descriptions, Dropdown, Input, Menu, Tag, Tooltip } from 'antd'
import { HomeOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, RouteComponentProps } from "react-router-dom"



export default class MarketPage extends Component<RouteComponentProps> {
    id: string = ""
    router: any
    history: any
    markets: Markets = {}
    readonly state: { selectedMarket?: Market, day: string } = {
        day: ""
    }

    marketsService: MarketsService

    constructor(props: any) {
        super(props)
        this.marketsService = new MarketsService()
    }

    updateMarket = (market: Market) => {
        //Update the market in the markets
        this.markets[this.id] = market
        localStorage.setItem('bwdm_cache_markets', JSON.stringify(this.markets))
        this.setState({
            selectedMarket: market
        })
    }

    componentDidMount = (): void => {
        this.refresh()
    }

    handleClose = (removedTag: any) => {
        if (this.state.day !== "" && this.state.selectedMarket) {
            const _events: Events = this.state.selectedMarket.events
            delete _events[removedTag]
            const _market: Market = { ...this.state.selectedMarket, events: _events }
            this.updateMarket(_market)
        }
    }

    refresh(): void {
        this.id = (this.props as any).match.params.id
        this.marketsService.retrieve().then((results: Markets) => {
            this.markets = results
            // Construct a new market when one does not exist
            if (!this.markets[this.id]) {
                console.debug("New market")
                const _newMarket: Market = {
                    id: 0,
                    name: "",
                    events: {}
                }
                this.setState({
                    selectedMarket: _newMarket
                })
            } else {
                this.setState({
                    selectedMarket: results[this.id]
                })
            }
        })
    }


    addDay = () => {
        if (this.state.day !== "" && this.state.selectedMarket) {
            const _events: Events = this.state.selectedMarket.events
            _events[this.state.day] = {}
            const _market: Market = { ...this.state.selectedMarket, events: _events }
            this.updateMarket(_market)
            this.setState({
                day: ""
            })
        }
    }

    render() {
        const menu = (
            <Menu onClick={(e: any) => {
                if (this.state.selectedMarket) {
                    const _market: Market = this.state.selectedMarket
                    _market.phase = e.key
                    this.updateMarket(_market)
                }
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
        )
        return <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/markets">
                        <span>Markten</span>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <span>{this.id}</span>
                </Breadcrumb.Item>
            </Breadcrumb>
            {this.state.selectedMarket &&
                <><Descriptions
                    key={this.id}>
                    <Descriptions.Item label="ID"><b>{this.id}</b></Descriptions.Item>
                    <Descriptions.Item label="Markt"><Input
                        className={`ant-input${this.state.selectedMarket.name ? " " : " onbekend"}`}
                        id={`market_${this.id}_name`}
                        placeholder="Vul naam in"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (this.state.selectedMarket) {
                                const _market: Market = this.state.selectedMarket
                                _market.name = e.target.value
                                this.updateMarket(_market)
                            }
                        }}
                        value={this.state.selectedMarket.name} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Fase">
                        <Dropdown.Button className={this.state.selectedMarket.phase || "onbekend"} overlay={menu}>
                            {this.state.selectedMarket.phase || "onbekend"}
                        </Dropdown.Button>
                    </Descriptions.Item>
                    {this.state.selectedMarket.plan &&
                        <Descriptions.Item>
                            <a href={`/data/pdf/${this.state.selectedMarket.plan.name}.pdf`} download>Download Plattegrond</a>
                        </Descriptions.Item>}
                    <Descriptions.Item label="Dagen">

                        {
                            Object.keys(this.state.selectedMarket.events).map((key: string, i: number) => {
                                return <Tag
                                    onClick={() => this.props.history.push({ pathname: `/market/day/${this.id}-${key}` })}
                                    onClose={() => this.handleClose(key)}
                                    color="blue"
                                    key={key}
                                    closable={true}>
                                    <span key={key} className="event">{key}</span>
                                </Tag>
                            })
                        }
                        <Input style={{ width: "60px", marginRight: "10px" }}
                            value={this.state.day}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                this.setState({
                                    day: e.target.value.toUpperCase()
                                })
                            }}
                        />
                        <Tooltip title="Dag toevoegen">
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<PlusOutlined />}
                                disabled={this.state.day !== "" ? false : true}
                                onClick={() => this.addDay()} />
                        </Tooltip>
                    </Descriptions.Item>
                </Descriptions></>
            }</>
    }
}