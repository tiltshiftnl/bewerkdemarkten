import React from "react"
import MarketDetail from "../components/MarketDetail"
import { MarketEventDetails } from "../models"
import MarketsService, { MarketService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb, Col, Row } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"
import MarketAllocation from "../components/MarketAllocation"

export default class MarketDetailPage extends DynamicBase {
    readonly state: { market: MarketEventDetails } = {
        market: {
            branches: [],
            pages: []
        }
    }

    marketService: MarketService
    marketsService: MarketsService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
        this.marketsService = new MarketsService()
    }

    refresh() {
        this.id = (this.props as any).match.params.id
        this.marketsService.retrieve().then(results => {
            const map = results[this.id.split('-')[0]].events[this.id.split('-')[1]]
            this.setState({
                event: map || undefined
            })
        })
        this.marketService.constructRelationalStructure(this.id).then(result => {
            this.setState({
                market: result,
                name: this.id
            })
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
                {this.id && <><Breadcrumb.Item><Link to={`/market/${this.id.split('-')[0]}`}>
                    <span>{this.id.split('-')[0]}</span></Link>
                </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>{this.id.split('-')[1]}</span>
                    </Breadcrumb.Item></>}
            </Breadcrumb>
            <Row>
                <Col><MarketDetail marketEvent={this.state.market} /></Col>
                <Col><MarketAllocation branches={this.state.market.branches}/></Col>
            </Row>
        </>
    }
}