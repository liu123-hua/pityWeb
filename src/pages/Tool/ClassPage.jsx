import { connect } from '@umijs/max'
import { Card, Button, Input, Select, Space, Switch, Divider, message, Tooltip, List, Typography } from 'antd'
import { result, set } from 'lodash';
import React, { useState, useEffect, useImperativeHandle, forwardRef, memo } from 'react'
import { checkxbClassFlag, checkJjClassBatchFlag, dividezeroUser } from '@/services/classpage';
import CONFIG from '@/consts/config';

const { TextArea } = Input;
let userData = {
    goodsId: "",
    usersId: [],
    assignClassInfoId: "",
    revenueProjectId: "",
    courseVersionId: "",
    divideType: ""
}

let RevenueProjectIdList = {
    "CS": "财商",
    "QN": "钢琴",
    "LC": "量财",
    "DSP": "短视频"
}

let divideTypeMap = {
    "xb": "小白分班",
    "jj": "进阶分班"
}


const ClassPage = (props, ref) => {

    const [goodsId, setGoodsId] = useState('');
    const [goodsIdXb, setGoodsIdXb] = useState('');
    const [goodsIdJj, setGoodsIdJj] = useState('');
    const [courseVersion, setCourseVersion] = useState('');
    const [usersID, setUsersID] = useState([])
    const [JjUserID, setJjUserID] = useState([])
    const [yxRevenueProjectId, setYxRevenueProjectId] = useState('CS')
    const [assignStatus, setAssignStatus] = useState(false)
    const [xbResult, setXbResult] = useState(true)
    const [jjResult, setJjResult] = useState(true)
    const [xbLoad, setXbLoad] = useState(false)
    const [jjLoad, setJjLoad] = useState(false)
    const [assignClassInfoId, setAssignClassInfoId] = useState({})
    const [divideData, setDivideData] = useState([])
    const [divideClassType, setDivideClassType] = useState("xb")




    const assignStatusonchange = (checked) => {
        if (!checked) {
            console.log(checked)
            setAssignClassInfoId("")
            setXbResult(true)

        } else {

            setXbResult(false)
        }
        setAssignStatus(checked)


    }

    // 初始化对象属性
    const initUserData = (params, attribute) => {
        Object.keys(params).forEach((key) => {
            if (key != attribute)
                if (key == "usersId")
                    params[key] = [];
                else
                    params[key] = '';
        })
        return params


    }

    const onCheckGoodsClass = (item) => {
        console.log(item)
        userData.goodsId = goodsId
        if (!userData.goodsId) {
            message.warning("商品包ID不能为空")
            return
        }
        let params = initUserData(userData, "goodsId")
        if (!item) {
            checkxbClassFlag(params).then((data) => {
                console.log(data)
                if (data.code == 0) {
                    setXbResult(false)
                    message.info(data.msg)
                    return
                }
                setXbResult(true)
                message.info(data.msg)
            })
        } else {
            checkJjClassBatchFlag(params).then((data) => {
                if (data.code == 0) {
                    setJjResult(false)
                    message.warning(data.msg)
                    return
                }
                setJjResult(true)
                message.warning(data.msg)
            })
        }



    }

    const setInputGoods = (e) => {
        setGoodsId(e.target.value)
    }

    const setInputCourseVersion = (e) => {
        setCourseVersion(e.target.value)
    }


    const setInputXbGoods = (e) => {
        setGoodsIdXb(e.target.value)
    }

    const setInputJjGoods = (e) => {
        setGoodsIdJj(e.target.value)
    }

    const setInputUsersId = (e) => {

        let usersIdList = e.target.value

        let userListTmp = usersIdList.split(",")
        usersIdList = userListTmp.filter(x => x != '')
        setUsersID(usersIdList)


    }

    //
    const setInputAssignClassInfoId = (e) => {
        setAssignClassInfoId(e.target.value)
    }


    //小白开始分班
    const UserDivide = () => {
        userData.divideType = divideClassType
        userData.goodsId = goodsIdXb
        userData.usersId = usersID
        userData.revenueProjectId = yxRevenueProjectId
        userData.courseVersionId = ''
        if (divideClassType == "xb") {
            if (assignStatus)
                userData.assignClassInfoId = assignClassInfoId
        }
        console.log(userData)
        setXbResult(true)
        setXbLoad(true)
        dividezeroUser(userData).then((item) => {
            if (item.code == 0) {
                setDivideData(item.data)
                setXbLoad(false)
                setXbResult(true)
            }
            setXbLoad(false)
        })

    }



    //业务线选择框
    const RevenueProjectIdOptions = () => {
        const options = [];
        Object.keys(RevenueProjectIdList).map((item) => {
            options.push(
                <Option key={item} value={item}>
                    {RevenueProjectIdList[item]}
                </Option>,
            )
        }
        )
        return (
            <Select
                defaultValue={"CS"}
                style={{ width: 120 }}
                onChange={(value) => selectRevenueProjectId(value)}
            >
                {options}
            </Select>
        );
    };

    //分班方式选择框
    const DivideTypeOptions = () => {
        const options = [];
        Object.keys(divideTypeMap).map((item) => {
            options.push(
                <Option key={item} value={item}>
                    {divideTypeMap[item]}
                </Option>,
            )
        }
        )
        return (
            <Select
                defaultValue={divideClassType}
                style={{ width: 120 }}
                onChange={(value) => selectDivideType(value)}
            >
                {options}
            </Select>
        );
    };


    const selectDivideType = (value) => {
        console.log(value)
        if (value == "jj" &&yxRevenueProjectId=="CS"){
            setJjResult(false)
        }
            
        setDivideClassType(value)
    }

    const selectRevenueProjectId = (value) => {
        if (value!="CS"){
            setJjResult(true)
        }
        setYxRevenueProjectId(value)


    }


    return (
        <Card>

            <div>
                <Space size="middle" align='center'>

                    <Space.Compact style={{ width: 700 }}>

                        <Input style={{ width: 100 }} placeholder="商品/商品包ID" onChange={(e) => setInputGoods(e)} value={goodsId} />
                        <Button type="primary" onClick={() => onCheckGoodsClass(0)} >检查课版是否有接量班级</Button>
                        <Button type="primary" onClick={() => onCheckGoodsClass(1)}>检查商品包是否存在可分配批次</Button>
                    </Space.Compact>

                </Space>
            </div>
            <Divider plain></Divider>
            <Space size="middle" align='center'>
                <Space.Compact style={{ width: 300 }}>
                    {DivideTypeOptions()}
                    <Input style={{ width: '40%' }} placeholder="商品ID" onChange={(e) => setInputXbGoods(e)} />
                    <TextArea style={{ width: '70%' }} rows={1} placeholder="学号" onChange={(e) => setInputUsersId(e)} />

                </Space.Compact>

                {divideClassType == 'xb' ?
                    (
                        <Switch
                            checkedChildren="指定班级"
                            unCheckedChildren="不指定班级"
                            checked={assignStatus}
                            onChange={assignStatusonchange} />

                    ) : (<></>)
                }


                {assignStatus ? (
                    <Space.Compact >
                        <Input style={{ width: 80 }} placeholder="班级ID" onChange={(e) => setInputAssignClassInfoId(e)} />
                    </Space.Compact>

                ) : (<></>)}
                {RevenueProjectIdOptions()}
                <Tooltip
                    title="请先检查商品绑定课版是否有接量班级">
                    <Button
                        type="primary"
                        disabled={divideClassType == "xb" ? xbResult : jjResult}
                        loading={xbLoad}
                        onClick={() => UserDivide()}>
                        开始分班
                    </Button>

                </Tooltip>
            </Space>
            <Divider plain></Divider>

            <List

                bordered
                dataSource={divideData}
                renderItem={(item) => (
                    <List.Item>
                        <Typography.Text mark>[ITEM]</Typography.Text> {item}
                    </List.Item>
                )}
            />

        </Card>

    )
}
export default ClassPage

