import { Button, InputNumber, Switch } from "antd";
import React, { Component } from "react";
import { AssignedBranche } from "../models";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default class MarketAllocation extends Component<{ branches: AssignedBranche[] }> {

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

    render() {
        return <><table>
            <tr><th>Code</th><th>Omschrijving</th><th>Verplicht</th><th>Maximum</th><th>Toegwezen</th><th></th></tr>
            {this.props.branches.map((branche, i) => {
                return <tr className={this.getClass(branche)}>
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

            })}</table>
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