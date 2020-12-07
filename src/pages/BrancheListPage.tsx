import { Breadcrumb, Button } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'
import { Branche } from "../models"
import { BrancheService } from "../services/service_lookup"
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getTextColor } from '../helpers/PresentationHelpers'
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
            <table>
                <thead>
                <tr><th>Code</th><th>Titel</th><th>Omschrijving</th><th></th></tr>
                </thead>
                <tbody>
                {this.state.branches.map((branche, i) => {
                    return <tr key={i} style={{ backgroundColor: branche.color, color: getTextColor(branche.color) }}>
                        <td>{branche.number ? branche.number : ""}</td>
                        <td>{branche.brancheId}</td>
                        <td>{branche.description}</td>
                        <td><MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => { 
                                if (this.state.branches) {
                                    const _branches = this.state.branches
                                    delete _branches[i]
                                    this.setState({
                                        branches: _branches
                                    })
                                }
                            }}
                        /></td>
                    </tr>

                })}</tbody></table>
            <Button
                onClick={() => { }}
                style={{ marginTop: '20px' }}
                icon={<PlusOutlined />}
            >Toevoegen</Button>
            <Button type="primary" htmlType="submit">
                Opslaan
        </Button></>
    }
}