// import "./App.css";
// import "antd/dist/antd.css";
import { Layout, Select, Button, message } from "antd";

import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import {
  DatePicker,
  Table,
  Space,
  Image,
  Popover,
  Typography,
  PageHeader,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment";

import ImageComponent from "./Component/ImageComp";
const { Text } = Typography;

const { Footer } = Layout;
function App() {
  const arr = [];
  const dateFormat = "YYYY-MM-DD";
  const [data, setData] = useState([]);
  // const [currentimg, setcurrentimg] = useState();
  const [startDate, setStartDate] = useState();
  const[panel, setPanel] = useState();
  const[camera, setCamera] = useState([]);

  // useEffect(() => {

    const onSubmit=()=>
    {
      if(startDate === undefined || panel === undefined || camera === undefined){
        message.error("Fill all fields");
      }
      else{
      
        for(let i=0; i<camera.length; i++){
      axios({
        method: "POST",
        url: `http://localhost:5001/trucktrack_api/get_data/`,
        data: {
          from_time: startDate + "T00:00:00",
          to_time: startDate + "T23:59:59",
          panel_no: panel,
          camera_no: camera[i]
          // "from_time": "2022-01-25T00:01:00.364Z",
          // "to_time": "2022-01-25T11:59:00.364Z",
          // panel_no: 500003,
          // camera_no: 5,
        },
      })
        .then((res) => {
          res.data.map((i) => {
            arr.push(i);
          })
          console.log("ARRRR: ", arr);

          const proc_data = [];
          arr.map((item) => {
            const filter_data = proc_data.filter((e) => e._uuid == item._uuid);
            if (filter_data.length == 0) {
              proc_data.push({
                _uuid: item._uuid,
                data: arr.filter((k) => k._uuid == item._uuid),
              });
            }
            console.log("lol");
          });
          setData(proc_data);
          // console.log(proc_data);
        })
        .catch((err) => {
          console.log(err);
        });
     }
    }
  }
  // }, [startDate, panel, camera]);

  const columns = [];
  columns.push (
    {
      title: 'ID',
      dataIndex: "_uuid",
      key: 'key',
      width: 200
    },
  );
  columns.push (
    {
      title: 'Camera',
      dataIndex: "data",
      key: 'key',
      width: 300,
      render: (record) => {
        return record[0]['channel_name'];
      }
    },
  );
  columns.push({
    title: "TRUCK: ",
    dataIndex: "data",
    key: "key",
    width: 300,
    // fixed: "left",
    render: (record) => {
      const img1 = record[0].get_presignedUrl;
      return <Image src={img1}></Image>;
    },
  });
  const imgref = useRef(null);

  for (let i = 0; i < 24; i++) {
    var c = i;
    if (c >= 10) {
      c = c + ":00";
    } else {
      c = "0" + c + ":00";
    }
    columns.push({
      title: c,
      dataIndex: "data",
      key: "key",
      width: 70,
      render: (record) => {
        const val = record.filter(
          (item) => moment(item["datetime_utc"]["$date"]).hour() == i
        );

        if (val.length != 0) {
          return {
            children: (
              <Popover
                // trigger="click"
                destroyTooltipOnHide={true}
                content={
                  <Image.PreviewGroup justify='space-between'>
                  
                    {val.map((v, i) => (
                      <Space size={50}>
                      <ImageComponent
                        url={v.get_presignedUrl}
                        objs={v.truck_list}
                      />
                      </Space>
                    ))}
               
                  </Image.PreviewGroup>
                }
              >
                <CheckOutlined style={{ color: "green", size: '100px' }} />
              </Popover>
            ),
          };
        } else {
          return {
            children: <CloseOutlined style={{ color: "red", size: '100px' }} />,
          };
        }
      },
    });
  }
  function onChange(date, dateString) {
    setStartDate(dateString);
  }
  function onChangePanel(value){
    setPanel(value)
    // console.log(value)
  }
  function onChangeCamera(value){
    setCamera(value)
    // console.log(value)
  }
  const { Option } = Select
  return (
    <div className="App">
      <PageHeader
        className="site-page-header"
        // onBack={() => null}
        title="Truck Tracking"
        // subTitle="This is a subtitle"
      />
      <Space direction="horizontal">
        <Text strong>Select Date</Text>
        <DatePicker
          allowClear={true}
          onChange={onChange}
          format={dateFormat}
        />
        
        <Text strong>Select Panel</Text>
      <Select placeholder='Panel'  onChange={onChangePanel} allowClear={true} style={{width:"100px"}}>
         <Option value={500003}>500003</Option>
      </Select>

       <Text strong>Select Camera</Text>
       <Select placeholder='Camera'  onChange={onChangeCamera} allowClear={true} mode="multiple" style={{width:"170px"}}>
         <Option value={5} >5</Option>
         <Option value={6} >6</Option>
         <Option value={7} >7</Option>
       </Select>
       <Button type="primary" onClick={onSubmit}>Submit</Button>
      
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        scroll={{y: 400, x:"100vw"}}
        // scroll={{ y: "calc(100vh - 4em)", x: "100vw" }}
        size="large"
        pagination={true}
      ></Table>

      <Footer
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          height: 2
        }}
      >
        Copyright 2022, All rights reserved &copy;
      </Footer>
    </div>
  );
}
export default App;
