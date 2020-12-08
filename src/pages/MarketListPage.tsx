import { HomeOutlined, // PlusSquareOutlined, EditOutlined 
} from '@ant-design/icons'
import { Button, Col, Row, //Space 
} from "antd"
import React, { Component } from "react"
import { Market, Markets } from "../models"
import MarketsService from "../services/service_markets"
import MarketListItem from '../components/MarketListItem'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { //MinusCircleOutlined, 
    PlusOutlined } from '@ant-design/icons'
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
            <Row gutter={[16, 16]}>
                {Object.keys(this.state.markets).map((key: string, i: number) => {
                    const market: Market = this.state.markets[key]
                    return <Col key={key} style={{ margin: "0.5em" }}>
                        <MarketListItem marketId={key} market={market} />
                    </Col>
                })}
            </Row>
                    <Button
                        onClick={() => {
                            // const _branches = this.state.branches || []
                            // _branches.push({
                            //     brancheId: "",
                            //     verplicht: false,
                            //     color: "#000",
                            //     backGroundColor: "#fff",
                            //     allocated: 0
                            // })
                            // this.setState({
                            //     branches: _branches
                            // })
                        }}
                        style={{ marginTop: '20px' }}
                        icon={<PlusOutlined />}
                    >Toevoegen</Button>
                    <Button type="primary" htmlType="submit">
                        Opslaan
            </Button>
        </>
    }
}