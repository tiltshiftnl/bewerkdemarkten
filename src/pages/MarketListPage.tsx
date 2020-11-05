import { PlusSquareOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Row, Space } from "antd"
import React, { Component } from "react"
import { Market, Markets } from "../models"
import MarketsService from "../services/service_markets"
import MarketListItem from '../components/MarketListItem';

export default class MarketListPage extends Component {

    readonly state: { markets: Markets } = {
        markets: {}
    }

    marketsService: MarketsService


    constructor(props: any) {
        super(props)
        this.marketsService = new MarketsService()
    }

    componentDidMount = () => {
        this.marketsService.retrieve().then((markets: Markets) => {
            this.setState({
                markets
            })
        })
    }

    render() {
        return <>
            {Object.keys(this.state.markets).map((key: string, i: number) => {
                const market: Market = this.state.markets[key]
                return <MarketListItem marketId={key} market={market} />
            })}
            <Row>
                <Space>
                    <Button title="Nieuwe leeg" type="primary" icon={<PlusSquareOutlined />}>Nieuwe leeg</Button>
                    <Button title="Aanpassen bronbestand markten" type="primary" icon={<EditOutlined />}>Aanpassen bronbestand markten</Button>
                </Space>
            </Row>
        </>
    }
}