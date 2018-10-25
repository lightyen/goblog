import React, { Component } from "react"

import { Layout } from "antd"
import MyTable from "com/MyTable"
import { AutoComplete, Upload, Button, message } from "antd"
import { Icon } from "antd"
import { UploadChangeParam } from "antd/lib/upload"

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
                    <Upload name="file" action="" headers={null} onChange={this.onChange}>
                        <Button>
                            <Icon type="upload" /> Click to Upload
                        </Button>
                    </Upload>
                </Layout.Content>
            </Layout>
        )
    }

    private onChange(info: UploadChangeParam) {

        if (info.file.status !== "uploading") {
            // console.log(info.file, info.fileList)
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`)
            const reader = new FileReader()
            // 讀取成功
            reader.onload = (event: ProgressEvent) => {
                const buffer = event.target["result"] as ArrayBuffer
                const array = new Uint8Array(buffer)
                console.log(array)
            }
            reader.readAsArrayBuffer(info.file.originFileObj)
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`)
        }
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
