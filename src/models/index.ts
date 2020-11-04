export interface Event {

}

export interface Events {
    [key: string]: Event
}

export interface Assignment {
    class: string
    title: string
    landmarkTop: string
    landmarkBottom: string
    plaatsList: string[]
}

export interface Page {
    title: string
    indelingslijstGroup: Assignment[]
}

export interface Market {
    id: number
    name: string
    phase?: string
    events: Events
}

export interface Location {
    plaatsId: string
    branches?: string[]
    verkoopinrichting?: string[]
    properties?: string[]
}
export interface Obstacle {
    kraamA: string
    kraamB: string
    obstakel: string[]
}

export interface Geography {
    obstakels: Obstacle[]
}

export interface Branch {
    brancheId: string
    verplicht: boolean
}

export interface Markets {
    [key: string]: Market
}