import React, { createRef, RefObject } from "react"
import MarketDetail from "../components/MarketDetail"
import { MarketService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb, Tabs } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"
import { Branche } from "../models"
import { BrancheService } from "../services/service_lookup"
import MarketBrancheList from "../components/MarketBrancheList"

const { TabPane } = Tabs

export default class MarketDetailPage extends DynamicBase {
    readonly state: { lookupBranches?: Branche[] } = {}

    marketBrancheListRef: RefObject<MarketBrancheList>
    marketDetailRef: RefObject<MarketDetail>

    marketService: MarketService

    lookupBrancheService: BrancheService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
        this.lookupBrancheService = new BrancheService()

        this.marketBrancheListRef = createRef()
        this.marketDetailRef = createRef()
    }

    refresh() {
        this.id = (this.props as any).match.params.id
        this.lookupBrancheService.retrieve().then((lookupBranches: Branche[]) => {
            this.setState({
                lookupBranches
            })
        })
        this.marketService.constructRelationalStructure(this.id).then(result => {
            this.marketBrancheListRef.current?.setState({
                branches: result.branches
            })
            this.marketDetailRef.current?.setState({
                marketEventDetails: result
            })
        }).catch((e: Error) => {
            console.log(e)
            // No result
            this.setState({
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
            {this.state.lookupBranches &&
                <Tabs defaultActiveKey="0">
                    <TabPane tab="Details" key="0">
                        <MarketDetail ref={this.marketDetailRef} lookupBranches={this.state.lookupBranches} />
                    </TabPane>
                    <TabPane tab="Branchelijst" key="1" forceRender={true}>
                        <MarketBrancheList ref={this.marketBrancheListRef} lookupBranches={this.state.lookupBranches} />
                    </TabPane>
                </Tabs>}
        </>
    }
}