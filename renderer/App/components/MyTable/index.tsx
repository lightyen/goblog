import React, { Component } from "react"
import { Table } from "antd"
import { ColumnProps } from "antd/lib/table"

interface DataType {
    key: number
    name: string
    age: number
    address: string
}

const columns: Array<ColumnProps<DataType>> = [
    {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.length - b.name.length,
    }, {
        title: "Age",
        dataIndex: "age",
        defaultSortOrder: "descend",
        sorter: (a, b) => a.age - b.age,
    }, {
        title: "Address",
        dataIndex: "address",
        key: "address",
    },
]

const data: DataType[] = [
    {
        key: 1,
        name: "🇹🇼  John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    }, {
        key: 2,
        name: "🇹🇼  Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
    }, {
        key: 3,
        name: "🇹🇼  Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
    }, {
        key: 4,
        name: "🇹🇼  Jim Red",
        age: 32,
        address: "London No. 2 Lake Park",
    },
]

interface ComponentProp {

}

interface ComponentState {
    loading: boolean
}

export default class extends Component<ComponentProp, ComponentState> {
    constructor(prop: ComponentProp) {
        super(prop)
        this.state = {
            loading: true,
        }
    }

    public render() {
        return (
            <Table {...this.state} columns={columns} dataSource={data}/>
        )
    }

    public componentDidMount() {
        setTimeout(this.add.bind(this), 500)
        setTimeout(this.finish.bind(this), 1000)
    }

    private add() {
        data.push(
            {
                key: 5,
                name: "🇹🇼  Lightyen",
                age: 28,
                address: "London No. 2 Lake Park",
            },
        )
    }

    private finish() {
        this.setState({...this.state, loading: false})
    }
}
