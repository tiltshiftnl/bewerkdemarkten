import { Breadcrumb } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'
import { LotPropertyService } from "../services/service_lookup"

export default class ObstacleListPage extends Component {
    readonly state: { properties: string[] } = {
        properties: []
    }

    propertyService: LotPropertyService

    constructor(props: any) {
        super(props)
        this.propertyService = new LotPropertyService()
    }


    componentDidMount = () => {
        this.propertyService.retrieve().then((properties: string[]) => {
            this.setState({
                properties
            })
        })
    }
    render() {
        return <><Breadcrumb>
            <Breadcrumb.Item>
                <Link to="/">
                    <HomeOutlined />
                </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to="/properties">
                    <span>Plaatseigenschappen</span>
                </Link>
            </Breadcrumb.Item>
        </Breadcrumb>
            <ul>{this.state.properties.map((obstacle: string) => {
                return <li>{obstacle}</li>
            })}
            </ul>
        </>
    }
}