import FullCalendar from "@fullcalendar/react";
import React, { Component } from "react";
import DaysClosedService from "../services/service_daysclosed";
import nlLocale from '@fullcalendar/core/locales/nl'
import dayGridPlugin from '@fullcalendar/daygrid'

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
            const _daysClosed: Event[] = daysClosed.map(entry => {
                return {
                    title: "Gesloten",
                    date: entry,
                    display: 'background',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                }
            })
            _daysClosed.push({
                groupId: 'blueEvents', // recurrent events in this group move together
                title: 'Dappermarkt',
                daysOfWeek: ['4'],
                backgroundColor: 'rgba(255,0,0,0.2)'
            })
            this.setState({
                daysClosed: _daysClosed
            })
        })
    }
    render() {
        return <FullCalendar
            height={"auto"}
            aspectRatio={1}
            locale={nlLocale}
            plugins={[dayGridPlugin]}
            events={this.state.daysClosed}
            initialView="dayGridMonth"
        />
    }
}