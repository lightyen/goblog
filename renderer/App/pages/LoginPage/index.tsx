import React, { Component , MouseEvent, ChangeEvent, CSSProperties } from "react"
import { Redirect } from "react-router-dom"
import axios, { AxiosResponse, AxiosError } from "axios"
import intl from "react-intl-universal"
import { locales, getLocale } from "root/i18n"

import { Button, Input, Row, Col, Layout, Form } from "antd"
import { Icon } from "antd"

import * as style from "./index.scss"

interface ResponseToken {
    token: string
}

interface ComponentProps {

}

interface ComponentState {
    warning: boolean
    logined: boolean
    initDone: boolean
    username: string
    password: string
}

const divStyle: CSSProperties = {
    margin: "25px 0px 0px 0px",
}

class LoginPage extends Component<ComponentProps, ComponentState> {
    private userNameInput: Input
    constructor(prop: ComponentProps) {
        super(prop)
        this.state = {
            warning: false,
            logined: false,
            initDone: false,
            username: "",
            password: "",
        }
    }

    public render() {
        if (!this.state.initDone) {
            return null
        }

        if (this.state.logined) {
            return <Redirect to="/Home" />
        }

        const { username, password } = this.state
        const suffix = username ? <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} /> : null

        const LoginForm = (
        <Form onSubmit={this.handleSubmit.bind(this)}>
            <Form.Item>
                <Input
                    placeholder={intl.get("enterUsername")}
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                    suffix={suffix}
                    value={username}
                    onChange={this.onChangeUserName.bind(this)}
                    ref={(node: Input) => this.userNameInput = node}
                />
            </Form.Item>
            <Form.Item>
                <Input
                    placeholder={intl.get("enterPassword")}
                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="password"
                    value={password}
                    onChange={this.onChangePassword.bind(this)}
                />
            </Form.Item>
            <Form.Item>
                <Button className={style.hahaStyle} type="primary" htmlType={"submit"} block>{intl.get("login")}</Button>
            </Form.Item>
        </Form>
        )

        const LoginPanel = (
        <Layout className={style.loginPanel}>
            <Row style={divStyle}>
                <Input
                    placeholder={intl.get("enterUsername")}
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                    suffix={suffix}
                    value={username}
                    onChange={this.onChangeUserName.bind(this)}
                    ref={(node: Input) => this.userNameInput = node}
                />
            </Row>
            <Row style={divStyle}>
                <Input
                    placeholder={intl.get("enterPassword")}
                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="password"
                    value={password}
                    onChange={this.onChangePassword.bind(this)}
                />
            </Row>
            <Row style={divStyle}>
                <Button className={style.hahaStyle} type="primary" block onClick={this.LoginClick.bind(this)}>{intl.get("login")}</Button>
            </Row>
        </Layout>
        )

        return (
        <Layout className={style.page}>
            <Layout.Content>
                <Row style={{height: "100%"}} type="flex" justify="center" align="middle">
                    <Col xs={{ span: 6 }}  sm={{span: 7}}  md={{span: 8}} lg={{ span: 9.5 }} />
                    <Col xs={{ span: 12 }} sm={{span: 10}} md={{span: 8}} lg={{ span: 5 }}>{LoginForm}</Col>
                    <Col xs={{ span: 6 }}  sm={{span: 7}}  md={{span: 8}} lg={{ span: 9.5 }} />
                </Row>
            </Layout.Content>
        </Layout>
        )
    }

    public async componentDidMount() {
        intl.init({ currentLocale: getLocale(), locales })
        .then(async () => {
            const token = localStorage.getItem("jwtToken")
            if (token !== null) {
                const valid = await this.validateToken(token)
                this.setState({...this.state, logined: valid, initDone: true})
            } else {
                this.setState({...this.state, logined: false, initDone: true})
            }
        })
    }

    private emitEmpty() {
        this.userNameInput.focus()
        this.setState({...this.state, username: "" })
    }

    private LoginClick(e: MouseEvent<HTMLElement>) {
        const user = {
            username: this.state.username,
            password: this.state.password,
        }
        axios.post("/token/new", user)
        .then((response: AxiosResponse<ResponseToken>) => {
            if (response.status === 200) {
                localStorage.setItem("jwtToken", response.data.token)
                this.setState({...this.state, logined: true})
            }
        })
        .catch((err) => {
            const ee = err as AxiosError
            console.log(ee.response.data)
        })

        // fetch("apis/v1/boxes")
        // .then((res) => {
        //     if (res.status === 200) {
        //         console.log(res)
        //     }
        // })
        // .catch((err) => {
        //     console.error(err)
        // })
    }

    private handleSubmit(e: React.FormEvent<HTMLElement>) {
        e.preventDefault()
        const user = {
            username: this.state.username,
            password: this.state.password,
        }
        axios.post("/token/new", user)
        .then((response: AxiosResponse<ResponseToken>) => {
            if (response.status === 200) {
                localStorage.setItem("jwtToken", response.data.token)
                this.setState({...this.state, logined: true})
            }
        })
        .catch((err) => {
            const error = err as AxiosError
            console.log(error.response.data)
        })
    }

    private async validateToken(token: string): Promise<boolean> {
        interface Response {
            validated: boolean
        }
        try {
            const res = await axios.post<Response>("/token/test", {token})
            return res.data.validated
        } catch (err) {
            const e = err as AxiosError
            console.log(e)
            return false
        }
    }

    private onChangeUserName(e: ChangeEvent<HTMLInputElement>) {
        this.setState({...this.state, username: e.target.value})
    }

    private onChangePassword(e: ChangeEvent<HTMLInputElement>) {
        this.setState({...this.state, password: e.target.value})
    }
}

export default LoginPage
