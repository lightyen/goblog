import React, { Component } from "react"

import { Layout } from "antd"
import MyTable from "com/MyTable"
import { AutoComplete } from "antd"

interface ComponentProps {

}

interface ComponentState {
    data: string[]
}

export class TestPage extends Component<ComponentProps, ComponentState> {
    constructor(prop: ComponentProps) {
        super(prop)
        this.state = {
            data: [],
        }
    }

    public render() {
        return (
            <Layout>
                <Layout.Header style={{color: "#FFFFFF"}}>
                    Hello
                </Layout.Header>
                <Layout.Content>
                    <AutoComplete
                        dataSource={this.state.data}
                        onSearch={this.handleSearch.bind(this)}
                        onSelect={this.handleSelect.bind(this)}
                    />
                </Layout.Content>
            </Layout>
        )
    }

    private handleSearch(value: string) {
        const t: string[] = []
        for (let i = 0; i < 5; i++) {
            t.push(this.getR())
        }
        this.setState({...this.state, data: t})
    }

    private handleSelect(value: string) {
        console.log(value)
    }

    private getR(): string {
        const getChar = () => Math.floor(Math.random() * 26) + 65
        const k: number[] = []
        for (let i = 0; i < 5; i++) {
            k.push(getChar())
        }

        return String.fromCodePoint(...k)
    }
}
