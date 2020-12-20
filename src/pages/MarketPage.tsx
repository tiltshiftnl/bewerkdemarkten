import React from "react"
import { Market } from "../models"
import MarketsService from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import MarketDayItem from "../components/MarketDayItem"
import { Link } from "react-router-dom"

export default class MarketPage extends DynamicBase {
    readonly state: { market?: Market } = {}

    marketsService: MarketsService

    constructor(props: any) {
        super(props)
        this.marketsService = new MarketsService()
    }

    componentDidMount = (): void => {
        this.refresh()
    }

    refresh(): void {
        this.id = (this.props as any).match.params.id
        this.marketsService.retrieve().then((results) => {
            // Construct a new market when one does not exist
            if (!results[this.id]) {
                console.log("Nieuwe markt?")
                const _newMarket: Market = {
                    id: 0,
                    name: "",
                    events: {}
                }
                this.setState({
                    market: _newMarket
                })
            } else {
                this.setState({
                    market: results[this.id]
                })
            }
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
                <Breadcrumb.Item>
                    <span>{this.id}</span>
                </Breadcrumb.Item>
            </Breadcrumb>
            {this.state.market &&
                <MarketDayItem marketId={this.id} market={this.state.market} />
            }
        </>
    }
}