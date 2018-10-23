import React, { Component } from "react"
import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "./router"

export default class extends Component {
    public render() {
        return (
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        )
    }
}
