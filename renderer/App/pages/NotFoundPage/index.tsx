import React, { Component } from "react"

interface ComponentProps {

}

interface ComponentState {

}

export default class extends Component<ComponentProps, ComponentState> {
    public render() {
        return (
        <div>
            <h1>404 找不到</h1>
            <a href="./">返回</a>
        </div>
        )
    }
}
