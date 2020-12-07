import { Breadcrumb, //Button, 
    Col, Input, Row } from "antd"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'
import { ObstacleTypeService } from "../services/service_lookup"
//import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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

    add = () => {
        const props: string[] = this.state.obstacles
        props.push("")
        this.setState({
            properties: props
        })
    }

    remove = (property: string) => {
        const props: string[] = this.state.obstacles
        const _idx: number = props.indexOf(property)
        if (_idx > -1) {
            props.splice(_idx, 1)
        }
        this.setState({
            properties: props
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
            {this.state.obstacles.map((obstacle: string) => {
                return <Row gutter={[8, 8]}><Col><Input value={obstacle} disabled={true}/></Col><Col>
                {/* <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => this.remove(obstacle)}
                /> */}
                </Col></Row>
            })}
            {/* <Button
                onClick={() => {
                    this.add();
                }}
                style={{ marginTop: '20px' }}
                icon={<PlusOutlined />}
            >Toevoegen</Button>
            <Button type="primary" htmlType="submit">
                Opslaan
        </Button> */}
        </>
    }
}