import React, { ChangeEvent, Component } from "react"
import { Market, Markets, Events, DayOfWeek, WeekDays } from "../models"
import MarketsService, { PagesService } from "../services/service_markets"
import { Breadcrumb, Button, Descriptions, Dropdown, Input, Menu, Modal, Tag } from 'antd'
import { HomeOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, RouteComponentProps } from "react-router-dom"



export default class MarketPage extends Component<RouteComponentProps> {
    id: string = ""
    router: any
    history: any
    markets: Markets = {}
    weekdays: DayOfWeek[] = WeekDays
    readonly state: { selectedMarket?: Market, day: DayOfWeek, showModal: boolean } = {
        day: {
            id: 0,
            name: "",
            abbreviation: ""
        },
        showModal: false
    }

    marketsService: MarketsService
    pagesService: PagesService

    constructor(props: any) {
        super(props)
        this.marketsService = new MarketsService()
        this.pagesService = new PagesService()
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
        if (this.state.day.name !== "" && this.state.selectedMarket) {
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
        if (this.state.day.abbreviation !== "" && this.state.selectedMarket) {
            const _events: Events = this.state.selectedMarket.events
            _events[this.state.day.abbreviation] = {}
            const _market: Market = { ...this.state.selectedMarket, events: _events }

            this.updateMarket(_market)
            this.setState({
                day: {id: 0, name: "", abbreviation: ""}
            })
        }
    }


    handleOk = () => {
        if (this.state.day.abbreviation !== "" && this.state.selectedMarket) {
            const _events: Events = this.state.selectedMarket.events
            _events[this.state.day.abbreviation] = {}
            const _market: Market = { ...this.state.selectedMarket, events: _events }
            // POST a new empty pagina's set to the backend
            this.pagesService.update(`${this.id}-${this.state.day.abbreviation}`, [])
            this.updateMarket(_market)
            this.setState({
                day: {id: 0, name: "", abbreviation: ""},
                showModal: false
            })
        }
    };

    handleCancel = () => {
        this.setState({
            showModal: false
        })
    };

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
                                let color = "blue"
                                if(this.state.selectedMarket && !this.state.selectedMarket.events[key].weekday) {
                                    color = "purple"
                                }
                                return <Tag
                                    onClick={() => this.props.history.push({ pathname: `/market/day/${this.id}-${key}` })}
                                    onClose={() => this.handleClose(key)}
                                    color={color}
                                    key={key}
                                    closable={true}>
                                    <span key={key} className="event">{key}</span>
                                </Tag>
                            })
                        }
                        <Button
                            type="dashed"
                            onClick={() => {
                                this.setState({
                                    showModal: true
                                })
                            }}
                            style={{ marginTop: '20px' }}
                            icon={<PlusOutlined />}
                        >Toevoegen</Button>
                        <Modal
                            title="Nieuwe dag"
                            visible={this.state.showModal}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            cancelText="Annuleren"
                        >
                            <Input value={this.state.day.abbreviation} placeholder="Dag afkorting, bijv: 'MA' of 'ANT'" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const _d = this.state.day
                                _d.abbreviation = e.target.value.toUpperCase() || "" 
                                this.setState({
                                    day: _d
                                })
                            }} />
                            {/* <i style={{color: "#ccc"}}>Optioneel, selecteer een weekdag indien van toepassing</i>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Kies een dag"
                                value={this.state.day.abbreviation || ""}
                                onChange={(e: string) => {
                                    const _selectedDay: DayOfWeek = this.weekdays.filter((item: DayOfWeek) => item.abbreviation === e)[0]
                                    this.setState({
                                        day: _selectedDay
                                    })
                                    // if (this.state.branches && _selectedBranche) {
                                    //     const _branches = this.state.branches
                                    //     _branches[i].brancheId = _selectedBranche.brancheId
                                    //     _branches[i].backGroundColor = _selectedBranche.color
                                    //     _branches[i].color = getTextColor(_selectedBranche.color)
                                    //     // Find the color, set the foreground color with the function.
                                    //     this.updateAssignedBranches(_branches)
                                    // }
                                }}
                            >
                                {this.weekdays.map((day, i) => {
                                    return <Select.Option key={i} value={day.abbreviation}>{day.name}</Select.Option>
                                })}
                            </Select> */}
                        </Modal>
                    </Descriptions.Item>
                </Descriptions></>
            }</>
    }
}