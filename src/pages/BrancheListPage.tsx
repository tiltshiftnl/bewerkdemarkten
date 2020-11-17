import { Breadcrumb, Button } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'
import { Branche } from "../models"
import { BrancheService } from "../services/service_lookup"
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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

    getTextColor(hexcolor: string){
        var r = parseInt(hexcolor.substr(1,2),16);
        var g = parseInt(hexcolor.substr(3,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        // Return new color if to dark, else return the original
        return (yiq < 40) ? '#2980b9' : "black";
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
                <tr><th>Code</th><th>Titel</th><th>Omschrijving</th><th></th></tr>
                {this.state.branches.map((branche, i) => {
                    return <tr style={{ backgroundColor: branche.color, color: this.getTextColor(branche.color) }}>
                        <td>{branche.number ? branche.number : ""}</td>
                        <td>{branche.brancheId}</td>
                        <td>{branche.description}</td>
                        <td><MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => { }}
                        /></td>
                    </tr>

                })}</table>
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