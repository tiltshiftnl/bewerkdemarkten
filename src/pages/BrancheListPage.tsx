import { Breadcrumb, Card } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'
import { Branche } from "../models"
import { BrancheService } from "../services/service_lookup"

export default class BrancheListPage extends Component {

    readonly state: { branches: Branche[] } = {
        branches: []
    }

    brancheService: BrancheService

    constructor(props: any) {
        super(props)
        this.brancheService = new BrancheService()
    }


    componentDidMount = () => {
        this.brancheService.retrieve().then((branches: Branche[]) => {
            console.log(branches)
            this.setState({
                branches
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
                <Link to="/branchess">
                    <span>Branches</span>
                </Link>
            </Breadcrumb.Item>
        </Breadcrumb>
            {this.state.branches.map((branche: Branche) => {
                return <Card title={branche.number ? branche.number : ""} style={{ margin: "1em", borderColor: branche.color ? branche.color : "#ccc" }}>
                    <p>
                        <em>{branche.brancheId}</em><br/>
                        {branche.description}
                        </p>
                </Card>
            })}
        </>
    }
}