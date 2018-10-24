import React, { Component } from "react"
import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "./router"
import { LocaleProvider } from "antd"
import zhTW from "antd/lib/locale-provider/zh_TW"

export default class extends Component {
    public render() {
        return (
            <BrowserRouter>
                <LocaleProvider locale={zhTW}>
                    <AppRouter />
                </LocaleProvider>
            </BrowserRouter>
        )
    }
}
