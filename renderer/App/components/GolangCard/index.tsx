import React, { Component } from "react"
import { Card } from "antd"
import gopher from "assets/images/golang.png"
import * as style from "./index.scss"

export class GopherCard extends Component {
    public render() {
        return (
        <div>
            <Card
                hoverable
                className={style.card}
                cover={<img alt="example" src={gopher} />}
            >
                <Card.Meta
                    title="Gopher"
                    description="The Go gopher is an iconic mascot and one of the most\
                     distinctive features of the Go project."
                />
            </Card>
        </div>
        )
    }
}
