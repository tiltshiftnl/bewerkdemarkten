import { GlobalStyle, Header, ThemeProvider } from '@amsterdam/asc-ui'
import React, { Component } from 'react'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage';
import MarketListPage from './pages/MarketListPage'
import MarketPage from './pages/MarketPage'
import NewMarketPage from './pages/NewMarketPage';

export default class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <GlobalStyle />
        <div className="App">
          <BrowserRouter>
            <Header tall={false} title="Bewerk de markten" fullWidth={false} homeLink="" />
            <ul className="menu-item-ul">
              <li className="menu-item-li"><NavLink className="menu-item" activeClassName="active" to="/markets">Markten</NavLink></li>
              <li className="menu-item-li"><NavLink className="menu-item" activeClassName="active" to="/calendar">Kalender</NavLink></li>
            </ul>
            <div style={{ padding: '2em' }}>
              <Switch>
                <Route path="/markets" component={MarketListPage} />
                <Route path="/market/new" exact component={NewMarketPage} />
                <Route path="/calendar" component={CalendarPage} />
                <Route path="/market/:id" exact component={MarketPage} />
                <Route path="/" component={MarketListPage} />
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    );
  }
}

