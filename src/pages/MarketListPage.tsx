import { HomeOutlined, PlusSquareOutlined, EditOutlined } from '@ant-design/icons'
import { Button, List, Row, Space } from "antd"
import React, { Component } from "react"
import { Market, Markets } from "../models"
import MarketsService from "../services/service_markets"
import MarketListItem from '../components/MarketListItem'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

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
            <List
                itemLayout="horizontal">

                {Object.keys(this.state.markets).map((key: string, i: number) => {
                    const market: Market = this.state.markets[key]
                    return <List.Item key={key}>
                        <MarketListItem marketId={key} market={market} />
                    </List.Item>
                })}
            </List>
            <Row>
                <Space>
                    <Button title="Nieuwe leeg" type="primary" icon={<PlusSquareOutlined />}>Nieuwe leeg</Button>
                    <Button title="Aanpassen bronbestand markten" type="primary" icon={<EditOutlined />}>Aanpassen bronbestand markten</Button>
                </Space>
            </Row>
        </>
    }
}