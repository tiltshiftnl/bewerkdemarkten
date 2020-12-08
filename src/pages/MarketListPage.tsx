import { HomeOutlined } from '@ant-design/icons'
import { Button, Col, Row, Modal, Input } from "antd"
import React, { ChangeEvent, Component } from "react"
import { Market, Markets } from "../models"
import MarketsService from "../services/service_markets"
import MarketListItem from '../components/MarketListItem'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { //MinusCircleOutlined, 
    PlusOutlined
} from '@ant-design/icons'
export default class MarketListPage extends Component {

    readonly state: { markets: Markets, showModal: boolean, newMarketId: string } = {
        markets: {},
        showModal: false,
        newMarketId: ""
    }

    marketsService: MarketsService

    constructor(props: any) {
        super(props)
        this.marketsService = new MarketsService()
    }

    handleOk = () => {
        //Add the newMarket to the markets
        if (this.state.newMarketId !== "") {
            const _markets = this.state.markets
            _markets[this.state.newMarketId] = {
                id: 0,
                name: "",
                events: {}
            }

            this.setState({
                markets: _markets,
                showModal: false
            })
        }
    };

    handleCancel = () => {
        this.setState({
            showModal: false
        })
    };

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
                    this.setState({
                        showModal: true
                    })
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
            {/* <Button type="primary" htmlType="submit">
                Opslaan
            </Button> */}
            <Modal
                title="Markt toevoegen"
                visible={this.state.showModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelText="Annuleren"
            >
                <Input value={this.state.newMarketId} placeholder="Code" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    this.setState({
                        newMarketId: e.target.value.toUpperCase() || ""
                    })
                }} />
            </Modal>
        </>
    }
}