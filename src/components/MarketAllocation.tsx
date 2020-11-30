import { Button, InputNumber, Switch } from "antd";
import React, { Component } from "react";
import { AssignedBranche } from "../models";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CSS from 'csstype';

export default class MarketAllocation extends Component<{branches: AssignedBranche[]}> {
    readonly state: {branches?: AssignedBranche[]} = {
        branches: []
    }
    getStyle = (branche: AssignedBranche): CSS.Properties => {
        return {
            background: branche.backGroundColor || "#fff",
            color: branche.color || "#000"
        }
    }

    getClass(branche: AssignedBranche): string{
        let baseClass: string = ""
        if(branche.brancheId === "bak"){
            if(branche.verplicht){
                return "baking mandatory"
            }
            return "baking"
        }
        if(branche.maximumPlaatsen) {
            const allocated: number = branche.allocated || 0
            if(branche.maximumPlaatsen < allocated){
                baseClass += " over-assigned"
            }
            if (branche.maximumPlaatsen === allocated){
                baseClass += " assigned"
            } else {
                baseClass += " under-assigned"
            }
        } else {
            // Branche has no maximum
            if(branche.allocated){
                baseClass += " available"
            }
        }

        if(branche.verplicht){
            baseClass += " mandatory"
        }
        return baseClass.trim()
    }

    componentDidMount = () => {
        this.setState({
            branches: this.props.branches
        })
    }

    render() {
        return <><table>
            <thead>
                <tr><th>Code</th><th>Omschrijving</th><th>Verplicht</th><th>Maximum</th><th>Toegewezen</th><th></th></tr>
            </thead>
            <tbody>
            {this.state.branches && this.state.branches.map((branche, i) => {
                return <tr key={i} style={this.getStyle(branche)} className={this.getClass(branche)}>
                    <td>{branche.brancheId.split('-')[0]}</td>
                        <td>{branche.brancheId}</td>
                        <td><Switch checked={branche.verplicht} onChange={(checked: boolean) => {
                            branche.verplicht = checked
                        }} /></td>
                        <td><InputNumber min={0} max={99} defaultValue={branche.maximumPlaatsen || 0}/></td>
                        <td>{branche.allocated && <>{branche.allocated}</>}</td>
                        <td><MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => {}}
                /></td>
                    </tr>

            })}</tbody></table>
            <Button
                onClick={() => {}}
                style={{ marginTop: '20px' }}
                icon={<PlusOutlined />}
            >Toevoegen</Button>
            <Button type="primary" htmlType="submit">
                Opslaan
        </Button></>
    }
}