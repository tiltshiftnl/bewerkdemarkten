import React, { createRef, RefObject } from "react"
import MarketDay from "../components/MarketDay"
import { MarketService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb, Tabs } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"
import { Branche } from "../models"
import { BrancheService } from "../services/service_lookup"
import MarketDayBrancheList from "../components/MarketDayBrancheList"

const { TabPane } = Tabs

export default class MarketDayPage extends DynamicBase {
    readonly state: { lookupBranches?: Branche[] } = {}

    marketDayBrancheListRef: RefObject<MarketDayBrancheList>
    marketDayRef: RefObject<MarketDay>

    marketService: MarketService

    lookupBrancheService: BrancheService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
        this.lookupBrancheService = new BrancheService()

        this.marketDayBrancheListRef = createRef()
        this.marketDayRef = createRef()
    }

    refresh() {
        this.id = (this.props as any).match.params.id
        this.lookupBrancheService.retrieve().then((lookupBranches: Branche[]) => {
            this.setState({
                lookupBranches
            })
        })
        this.marketService.constructRelationalStructure(this.id).then(result => {
            this.marketDayBrancheListRef.current?.updateAssignedBranches(result.branches)
            this.marketDayRef.current?.setState({
                marketEventDetails: result
            })
        }).catch((e: Error) => {
            console.error(e)
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
                        <MarketDay ref={this.marketDayRef} lookupBranches={this.state.lookupBranches} />
                    </TabPane>
                    <TabPane tab="Branchelijst" key="1" forceRender={true}>
                        <MarketDayBrancheList id={this.id} ref={this.marketDayBrancheListRef} lookupBranches={this.state.lookupBranches} />
                    </TabPane>
                </Tabs>}
        </>
    }
}