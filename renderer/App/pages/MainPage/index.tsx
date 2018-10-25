import React, { Component } from "react"
import { Icon } from "antd"
import { version as antdVersion } from "antd"
import { Layout, Menu, Button, Row, Col, notification } from "antd"
import { ClickParam } from "antd/lib/menu"
import Hello from "com/Hello"
import { TestPage } from "../../pages"
import axios, { AxiosResponse, AxiosError } from "axios"
import { Redirect, Switch, Route, Link } from "react-router-dom"

import style from "./index.scss"
import MyTable from "com/MyTable"

interface ComponentProps {

}

interface ComponentState {
    redirectToLogin: boolean
    activeMenu: string
    collapsed: boolean
}

export default class extends Component<ComponentProps, ComponentState> {

    constructor(props: ComponentProps) {
        super(props)
        this.state = {
            redirectToLogin: false,
            activeMenu: "",
            collapsed: false,
        }
    }

    public render() {
        if (this.state.redirectToLogin) {
            return <Redirect to="/" />
        }

        return (
            <Layout className={style.main}>
                <Layout.Sider collapsed={this.state.collapsed} onCollapse={this.onCollapse.bind(this)} collapsible>
                    <Menu theme={"dark"} mode={"inline"} onClick={this.onMenuClick.bind(this)}>
                        <Menu.Item key="Test">
                            <Icon type="setting" spin />
                            <span>Option 1</span>
                        </Menu.Item>
                        <Menu.Item key="Table" >
                            <Icon type="desktop" />
                            <span>Option 2</span>
                        </Menu.Item>
                        <Menu.SubMenu
                            key="sub1"
                            title={<span><Icon type="user" /><span>User</span></span>}
                        >
                            <Menu.Item key="3">Tom</Menu.Item>
                            <Menu.Item key="4">Bill</Menu.Item>
                            <Menu.Item key="Alex">Alex</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Layout.Sider>
                <Layout>
                    <Layout.Header>
                        <Row type="flex" justify="end" align="middle">
                            <Col span={4}>
                                <Button onClick={this.logout.bind(this)}><Icon type="logout"/></Button>
                            </Col>
                        </Row>
                    </Layout.Header>
                    <Layout.Content>{this.renderContent()}</Layout.Content>
                    <Layout.Footer className={style.footer}>
                        Created by Helloworld <span>React:{React.version} Ant-design{antdVersion}</span>
                    </Layout.Footer>
                </Layout>
            </Layout>
        )
    }

    public componentDidMount() {
        notification.config({placement: "bottomRight"})
        setTimeout(() => {
            notification.info({message: "hello world", description: "hello hello world world"})
        }, 100)
    }

    private onCollapse(collapsed: boolean) {
        this.setState({...this.state, collapsed})
    }

    private renderContent(): JSX.Element {
        switch (this.state.activeMenu) {
            case "Test":
                return <TestPage/>
            case "Table":
                return <MyTable/>
            case "Alex":
                return <Hello/>
            default:
                return <TestPage/>
        }
    }

    private onMenuClick(param: ClickParam) {
        if (param.key !== this.state.activeMenu) {
            this.setState({...this.state, activeMenu: param.key})
        }
    }

    private logout() {
        interface Response {
            result: boolean
        }
        axios.get<Response>("/token/remove")
        .then((res) => {
            if (res.data.result) {
                this.setState({...this.state, redirectToLogin: true})
            }
        })
        .catch((err) => {
            const error = err as AxiosError
            console.log(error.response.data)
        })
    }
}
