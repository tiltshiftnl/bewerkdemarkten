import { Breadcrumb } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'

export default class PropertyListPage extends Component {
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
        Plaatseigenschappen - Nog niet beschikbaar</>
    }
}