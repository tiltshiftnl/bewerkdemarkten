import React, { createRef, RefObject } from "react"
import MarketDetail from "../components/MarketDetail"
import { MarketEventDetails } from "../models"
import MarketsService, { MarketService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb, Tabs } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"
import MarketAllocation from "../components/MarketAllocation"

const { TabPane } = Tabs

export default class MarketDetailPage extends DynamicBase {
    allocationRef: RefObject<MarketAllocation>
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
        this.allocationRef = createRef()
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
            this.allocationRef.current?.setState({
                branches: result.branches
            })
        })
    }

    marketEventStateChanged = (marketEvent: MarketEventDetails) => {
        console.log(marketEvent)
        this.setState({
            market: marketEvent
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
            <Tabs defaultActiveKey="1">
                <TabPane tab="Details" key="1">
                <MarketDetail marketEvent={this.state.market} branches={this.state.market.branches} stateChanged={this.marketEventStateChanged}/>
                </TabPane>
                <TabPane tab="Branchelijst" key="2">
                <MarketAllocation ref={this.allocationRef} branches={this.state.market.branches}/>
                </TabPane>
            </Tabs>
        </>
    }
}