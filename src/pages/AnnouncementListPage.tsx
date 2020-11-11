import { Breadcrumb } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'

export default class AnnouncementListPage extends Component {
    render() {
        return <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/announcements">
                        <span>Mededelingen</span>
                    </Link>
                </Breadcrumb.Item>
            </Breadcrumb>
        Mededelingen - Nog niet beschikbaar</>
    }
}