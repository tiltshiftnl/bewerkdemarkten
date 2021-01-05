import { HomeOutlined } from '@ant-design/icons'
import { Button, Col, Row, Modal, Input } from "antd"
import React, { ChangeEvent, Component } from "react"
import { DayOfWeek, Events, Market, Markets, WeekDays } from "../models"
import MarketsService, { PagesService } from "../services/service_markets"
import MarketListItem from '../components/MarketListItem'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { //MinusCircleOutlined, 
    PlusOutlined
} from '@ant-design/icons'
export default class MarketListPage extends Component {
    weekdays: DayOfWeek[] = WeekDays
    readonly state: { markets: Markets, showModal: boolean, newMarketId: string, day: DayOfWeek, newMarketInvalid?: string } = {
        markets: {},
        showModal: false,
        newMarketId: "",
        day: {
            id: 0,
            name: "",
            abbreviation: ""
        }
    }

    marketsService: MarketsService
    pagesService: PagesService
    constructor(props: any) {
        super(props)
        this.marketsService = new MarketsService()
        this.pagesService = new PagesService()
    }

    updateMarkets = (markets: Markets) => {
        localStorage.setItem('bwdm_cache_markets', JSON.stringify(markets))
        this.setState({
            markets
        })
    }

    handleOk = () => {
        //Add the newMarket to the markets
        if (this.state.newMarketId !== "") {
            const _markets = this.state.markets
            const _events: Events = {}
            if (this.state.day.abbreviation !== "") {
                _events[this.state.day.abbreviation] = {
                    weekday: 0
                }
                // POST a new empty pagina's set to the backend
                this.pagesService.update(`${this.state.newMarketId}-${this.state.day.abbreviation}`, [])
            }

            _markets[this.state.newMarketId] = {
                id: 0,
                name: "",
                events: _events
            }

            this.updateMarkets(_markets)
            this.setState({
                showModal: false
            })
        }
    };

    handleCancel = () => {
        this.setState({
            showModal: false
        })
    };

    componentDidMount = () => {
        this.marketsService.retrieve().then((markets: Markets) => {
            // Sort
            markets = Object.keys(markets).sort().reduce((result: any, key: string) => {
                result[key] = markets[key];
                return result;
            }, {})
            this.setState({
                markets
            })
        })
    }

    checkAbbreviation = (): boolean => {
        if (this.state.newMarketInvalid === "") {
            return false
        }
        return true
    }

    render() {
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
            </Breadcrumb>
            <Row gutter={[16, 16]}>
                {Object.keys(this.state.markets).sort().map((key: string, i: number) => {
                    const market: Market = this.state.markets[key]
                    return <Col key={key} style={{ margin: "0.5em" }}>
                        <MarketListItem marketId={key} market={market} />
                    </Col>
                })}
            </Row>
            <Button
                onClick={() => {
                    this.setState({
                        showModal: true
                    })
                }}
                style={{ marginTop: '20px' }}
                icon={<PlusOutlined />}
            >Toevoegen</Button>
            <Modal
                title="Nieuwe markt"
                visible={this.state.showModal}
                okButtonProps={{ disabled: this.checkAbbreviation() }}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelText="Annuleren"
            >

                <Input value={this.state.newMarketId} placeholder="Code" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.value !== "") {
                        if (Object.keys(this.state.markets).find((key: string) => key.toLowerCase() === e.target.value.toLowerCase())) {
                            this.setState({
                                newMarketId: e.target.value,
                                newMarketInvalid: "Markt bestaat al"
                            })
                        } else {
                            this.setState({
                                newMarketId: e.target.value,
                                newMarketInvalid: ""
                            })
                        }
                    } else {
                        this.setState({
                            newMarketId: "",
                            newMarketInvalid: "Code is vereist"
                        })
                    }

                }} />
                {this.state.newMarketInvalid !== "" && <div className="input-error">{this.state.newMarketInvalid}</div>}
                {!this.checkAbbreviation() && <>
                    <i>Maak een dag aan om de betreffende markt te initieren</i>
                    <Input value={this.state.day.abbreviation} placeholder="Dag afkorting, bijv: 'MA' of 'ANT'" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const _d = this.state.day
                        _d.abbreviation = e.target.value.toUpperCase() || ""
                        this.setState({
                            day: _d
                        })
                    }} /></>
                }

            </Modal>
        </>
    }
}