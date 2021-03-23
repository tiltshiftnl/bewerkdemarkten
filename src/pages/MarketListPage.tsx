import { HomeOutlined } from '@ant-design/icons'
import { Button, Col, Row, Modal, Input } from "antd"
import React, { ChangeEvent, Component } from "react"
import { DayOfWeek, Market, Markets, WeekDays } from "../models"
import MarketsService, { PagesService } from "../services/service_markets"
import MarketListItem from '../components/MarketListItem'
import { Breadcrumb } from 'antd'
import { Link, RouteComponentProps } from 'react-router-dom'
import { //MinusCircleOutlined, 
    PlusOutlined
} from '@ant-design/icons'
import { MMarkt } from '../models/mmarkt'
import { MMarktService } from '../services/service_mmarkt'
import { withRouter } from 'react-router-dom'

const { Search } = Input;

class MarketListPage extends Component<RouteComponentProps> {
    weekdays: DayOfWeek[] = WeekDays
    readonly state: { mmarkets: MMarkt[], markets: Markets, filter: "", filteredMarkets: Markets, showModal: boolean, newMarketId: string, day: DayOfWeek, newMarketInvalid?: string } = {
        mmarkets: [],
        markets: {},
        filter: "",
        filteredMarkets: {},
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
    mmarktService: MMarktService

    constructor(props: any) {
        super(props)
        this.marketsService = new MarketsService()
        this.pagesService = new PagesService()
        this.mmarktService = new MMarktService()
    }

    updateMarkets = (markets: Markets) => {
        localStorage.setItem('bwdm_cache_markets', JSON.stringify(markets))
        this.setState({
            markets
        }, () => {
            this.applyFilter()
        })
    }

    handleOk = () => {
        //Add the newMarket to the markets
        if (this.state.newMarketId !== "") {
            const _markets = this.state.markets
            //const _events: Events = {}
            // _events[this.state.day.abbreviation] = {
            //     weekday: 0
            // }
            // POST a new empty pagina's set to the backend
            //this.pagesService.update(`${this.state.newMarketId}`, [])

            _markets[this.state.newMarketId] = {
                id: 0,
                name: "",
                //events: _events
            }

            this.updateMarkets(_markets)
            this.setState({
                showModal: false
            })
            this.props.history.push(`/market/${this.state.newMarketId}`)
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
                markets,
                filteredMarkets: markets
            })
        })
        this.mmarktService.retrieve().then((mmarkets: MMarkt[]) => {
            const marketKeys: string[] = Object.keys(this.state.markets)
            const _markets: Markets = this.state.markets

            mmarkets.forEach((m: MMarkt) => {

                if (!marketKeys.includes(m.afkorting)) {
                    _markets[m.afkorting] = {
                        id: m.id,
                        name: m.naam,
                    }
                    if (m.kiesJeKraamFase) {
                        _markets[m.afkorting].phase = m.kiesJeKraamFase
                    }
                    if (m.aantalKramen) {
                        _markets[m.afkorting].stands = m.aantalKramen
                    }
                    //_markets[m.afkorting].municipality = "Amsterdam"
                }
            })
            this.setState({
                mmarkets: mmarkets,
                markets: _markets,
                filteredMarkets: _markets
            })
        })
    }

    checkAbbreviation = (): boolean => {
        if (this.state.newMarketInvalid === "") {
            return false
        }
        return true
    }

    onSearch = (value: string, e: any) => {
        console.log(value)
    }

    applyFilter = () => {
        const _filteredMarkets: Markets = {}
        if (this.state.filter === '') {
            this.setState({
                filteredMarkets: this.state.markets
            })
        } else {
            //const namematches = this.state.markets.filter((m: Market) => m.name === this.state.filter.toLowerCase() )
            Object.keys(this.state.markets).forEach((key: string) => {
                // Match by name
                if (this.state.markets[key].name.toLowerCase().includes(this.state.filter.toLowerCase())) {
                    _filteredMarkets[key] = this.state.markets[key]
                }
                if (key.toLowerCase().includes(this.state.filter.toLowerCase())) {
                    _filteredMarkets[key] = this.state.markets[key]
                }
            })

            this.setState({
                filteredMarkets: _filteredMarkets
            })
        }
    }
    onChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            filter: e.target.value
        }, () => {
            this.applyFilter()
        })

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
                <Col>
                    <Search placeholder="Filter markten" onChange={this.onChange} onSearch={this.onSearch} style={{ width: 200 }} />
                </Col>
                <Col key="add-market">
                    <Button
                        type="dashed"
                        onClick={() => {
                            this.setState({
                                showModal: true
                            })
                        }}
                        icon={<PlusOutlined />}
                    >Toevoegen</Button>
                </Col>
            </Row><Row gutter={[16, 16]}>
                {Object.keys(this.state.filteredMarkets).sort().map((key: string, i: number) => {

                    const market: Market = this.state.markets[key]
                    const mmarket = this.state.mmarkets.find(e => e.afkorting.toLowerCase() === key.toLowerCase())
                    if (mmarket) {
                        if (mmarket.kiesJeKraamFase) {
                            market.phase = mmarket.kiesJeKraamFase
                        }
                        if (mmarket && mmarket.naam) {
                            market.name = mmarket.naam
                        }
                        //market.municipality = "Amsterdam"
                    }
                    return <Col key={key} style={{ margin: "0.5em" }}>
                        <MarketListItem marketId={key} market={market} />
                    </Col>
                })}

            </Row>

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
            </Modal>
        </>
    }
}

export default withRouter(MarketListPage)