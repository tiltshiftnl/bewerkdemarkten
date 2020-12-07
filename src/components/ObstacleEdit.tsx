import { Col, Row, Checkbox } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import React, { Component } from "react"
import { AssignedBranche, Obstacle } from "../models"
import { ObstacleTypeService } from "../services/service_lookup"

interface ObstacleEditProps {
    branches: AssignedBranche[],
    changed?: (obstacle: Obstacle) => void
}

export default class LotEdit extends Component<ObstacleEditProps> {
    readonly state: { obstacle?: Obstacle, properties: string[] } = { properties: [] }
    typeService: ObstacleTypeService

    constructor(props: any) {
        super(props)
        this.typeService = new ObstacleTypeService()
    }


    componentDidMount = () => {
        this.typeService.retrieve().then((properties: string[]) => {
            this.setState({
                properties
            })
        })
    }

    componentDidUpdate(prevProps: ObstacleEditProps, prevState: { obstacle?: Obstacle }) {
        if (this.state.obstacle && this.props.changed && this.state !== prevState) {
            this.props.changed(this.state.obstacle)
        }
    }

    setType = (e: CheckboxChangeEvent) => {
        if (e.target.id) {
            if (this.state.obstacle) {
                let _obstakel: string[] = this.state.obstacle?.obstakel || []
                if (e.target.checked) {
                    _obstakel.push(e.target.id)
                } else {
                    _obstakel = _obstakel?.filter(p => p !== e.target.id)
                }
                this.setState({
                    obstacle: { ...this.state.obstacle, obstakel: _obstakel }
                })
            }
        }
    }

    getType(value: string): boolean {
        if (this.state.obstacle && this.state.obstacle.obstakel) {
            return this.state.obstacle.obstakel.indexOf(value) > -1
        }
        return false
    }

    render() {
        const firstColSpan = { xs: 8, sm: 8, md: 4, lg: 4 }
        const secondColSpan = { xs: 16, sm: 16, md: 8, lg: 8 }
        const formGutter: [number, number] = [4, 4]

        return <div className="edit-obstacle">
            {this.state.properties && this.state.properties.map((prop: string, i: number) => {
                return <Row key={i} gutter={formGutter}>
                <Col {...firstColSpan}>{prop.charAt(0).toUpperCase() + prop.slice(1)}</Col>
                <Col {...secondColSpan}><Checkbox id={prop} checked={this.getType(prop)} onChange={this.setType} /></Col>
            </Row>
            })}
         </div>
    }
}