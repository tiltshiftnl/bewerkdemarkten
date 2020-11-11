import { Breadcrumb } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'

export default class ObstacleListPage extends Component {
    render() {
        return <><Breadcrumb>
            <Breadcrumb.Item>
                <Link to="/">
                    <HomeOutlined />
                </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to="/obstacles">
                    <span>Obstakels</span>
                </Link>
            </Breadcrumb.Item>
        </Breadcrumb>Obstakels - Nog niet beschikbaar</>
    }
}