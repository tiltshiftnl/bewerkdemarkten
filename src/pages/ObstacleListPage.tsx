import { Breadcrumb } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'
import { ObstacleTypeService } from "../services/service_lookup"

export default class ObstacleListPage extends Component {
    readonly state: { obstacles: string[] } = {
        obstacles: []
    }

    brancheService: ObstacleTypeService

    constructor(props: any) {
        super(props)
        this.brancheService = new ObstacleTypeService()
    }


    componentDidMount = () => {
        this.brancheService.retrieve().then((obstacles: string[]) => {
            this.setState({
                obstacles
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
                <Link to="/obstacles">
                    <span>Obstakels</span>
                </Link>
            </Breadcrumb.Item>
        </Breadcrumb>
            <ul>{this.state.obstacles.map((obstacle: string) => {
                return <li>{obstacle}</li>
            })}
            </ul>
        </>
    }
}