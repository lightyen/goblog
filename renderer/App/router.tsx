import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import { LoginPage, MainPage, NotFoundPage } from "./pages"

export class AppRouter extends Component {
    public render() {
        return (
            <Switch>
                <Route exact path="/">
                    <LoginPage />
                </Route>
                <Route path="/Home">
                    <MainPage/>
                </Route>
                <Route path="*" component={NotFoundPage} />
            </Switch>
        )
    }
}

export default AppRouter
