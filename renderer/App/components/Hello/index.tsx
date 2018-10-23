import React, { Component } from "react"
import { Button, Row, Col, Layout } from "antd"
import { GopherCard } from "com/GolangCard"

export default class extends Component {
    public render() {
        return (
        <div>
            <Row>
                <Col span={12}>
                    <GopherCard />
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Button>Get</Button>
                </Col>
                <Col span={8}>col-8</Col>
                <Col span={8}>col-8</Col>
            </Row>
        </div>
        )
    }
}
