import React from "react"
import MarketDetail from "../components/MarketDetail"
import { Page, Rows, Lot, Event, Plan } from "../models"
import MarketsService, { BranchesService, LotsService, MarketService, PagesService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb, Col, Row, Tabs } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"
import { ReactSVG } from "react-svg"

const { TabPane } = Tabs

export default class MarketDetailPage extends DynamicBase {
    readonly state: { market: Rows, lots: Lot[], pages: Page[], name: string, branches: string[], event?: Event } = {
        market: {
            rows: [[]]
        },
        lots: [],
        pages: [],
        branches: [],
        name: "Gegevens worden opgehaald...",
        event: undefined
    }

    marketService: MarketService
    marketsService: MarketsService
    lotsService: LotsService
    pagesService: PagesService

    // Lookups
    branchesService: BranchesService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
        this.marketsService = new MarketsService()
        this.branchesService = new BranchesService()
        this.lotsService = new LotsService()
        this.pagesService = new PagesService()
    }

    refresh() {
        this.id = (this.props as any).match.params.id
        this.marketsService.retrieve().then(results => {
            console.log(this.id)
            const map = results[this.id.split('-')[0]].events[this.id.split('-')[1]]
            console.log(map)
            this.setState({
                event: map || undefined
            })
        })
        this.marketService.retrieve(this.id).then(result => {
            this.setState({
                market: result,
                name: this.id
            })
        })
        this.lotsService.retrieve(this.id).then(result => {
            this.setState({
                lots: result
            })
        })
        this.pagesService.retrieve(this.id).then(result => {
            this.setState({
                pages: result
            })
        })
    }

    marketChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ market: event.target.value });
    }

    lotsChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ lots: event.target.value });
    }

    pagesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ pages: event.target.value });
    }
    renderSvgPages(plan: Plan) {
        return <Tabs defaultActiveKey="1">
        {Array.from(Array(plan.pages), (e, i) => {
            return <TabPane tab={`Plattegrond-${i+1}`} key={i+1}>
            <ReactSVG key={i} useRequestCache={false} src={`/data/pdf/${plan.name}-${i + 1}.svg`} />
            </TabPane>
        })}
        </Tabs>
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
                {this.state.name && <><Breadcrumb.Item><Link to={`/market/${this.state.name.split('-')[0]}`}>
                    <span>{this.state.name.split('-')[0]}</span></Link>
                </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>{this.state.name.split('-')[1]}</span>
                    </Breadcrumb.Item></>}
            </Breadcrumb>
            <Row>
                <Col><MarketDetail base={this.state.market} lots={this.state.lots} pages={this.state.pages} /></Col>

                {this.state.event && this.state.event.plan &&
                    <Col>
                        {this.renderSvgPages(this.state.event.plan)}
                        <p style={{ margin: "1em" }}>
                            <a href={`/data/pdf/${this.state.event.plan.name}.pdf`} download>Download Plattegrond</a>
                        </p>
                    </Col>
                }
            </Row>
        </>
    }
}