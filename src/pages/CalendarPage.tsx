import React, { Component } from "react"
import { DaysClosedService } from "../services/service_lookup"
import { Breadcrumb, Calendar } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from "@amsterdam/asc-ui"
interface Event {
    title?: string
    date?: string
    display?: string
    backgroundColor?: string
    groupId?: string
    daysOfWeek?: string[]
    startTime?: string
    endTime?: string
}

export default class CalendarPage extends Component {
    readonly state: { daysClosed: Event[] } = {
        daysClosed: []
    }

    daysClosedService: DaysClosedService

    constructor(props: any) {
        super(props)
        this.daysClosedService = new DaysClosedService()
    }

    componentDidMount = () => {
        this.daysClosedService.retrieve().then((daysClosed: string[]) => {
            const _daysClosed: { type: string, content: string }[] = daysClosed.map(entry => {
                return {
                    type: "warning",
                    content: entry
                }
            })
            _daysClosed.push({
                type: 'success',
                content: "woop"
            })
            this.setState({
                daysClosed: _daysClosed
            })
        })
    }

    getListData(value: any) {
        let listData: { type: any, content: any }[] = []
        console.log(value.day())
        switch (value.day()) {
            case 3:
                listData = [
                    { type: 'warning', content: <Link to={'market/detail/DAPP-DI'}>DAPP-DI</Link> }
                 ];
                break
            case 4:
                listData = [
                    { type: 'success', content: <Link to={'market/detail/AC-WO'}>AC-WO</Link> }
                ];
                break
            case 6:
                listData = [
                    { type: 'error', content: <Link to={'market/detail/4045-ZA'}>4045-ZA</Link> }
                ];
                break
            default:
        }
        return listData
    }

    dateCellRender = (value: any) => {
        const listData = this.getListData(value);
        return (
            <ul className="events">
                {listData.map((item,i) => (
                    <li key={i}>
                        {item.content}
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        return <>
            <Breadcrumb>
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/calendar">
                    <span>Kalender</span>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Calendar dateCellRender={this.dateCellRender} />
        </>
    }
}