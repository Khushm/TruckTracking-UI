import "./App.css";
import "antd/dist/antd.css";
import { Layout } from "antd";

import React, { useState, useEffect, Children, useRef } from "react";
import axios from "axios";
import "antd/dist/antd.css";
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
  const dateFormat = "YYYY-MM-DD";
  const datetimeFormat = "";
  const [data, setData] = useState([]);
  // const [currentimg, setcurrentimg] = useState();
  const [startDate, setStartDate] = useState();

  useEffect(() => {
    console.log("....", startDate);
    axios({
      method: "POST",
      url: `http://192.168.2.118:5001/trucktrack_api/get_data/`,
      data: {
        from_time: startDate + "T00:01:00",
        to_time: startDate + "T23:59:00",

        // "from_time": "2021-10-01T00:01:00.364Z",
        // "to_time": "2021-10-01T11:59:00.364Z",
        panel_no: 500003,
        camera_no: 6,
      },
    })
      .then((res) => {
        const proc_data = [];
        res.data.map((item) => {
          const filter_data = proc_data.filter((e) => e._uuid == item._uuid);
          if (filter_data.length == 0) {
            proc_data.push({
              _uuid: item._uuid,
              data: res.data.filter((k) => k._uuid == item._uuid),
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
  }, [startDate]);

  const columns = [];

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
                destroyTooltipOnHide={true}
                content={
                  <Image.PreviewGroup>
                    {val.map((v, i) => (
                      <ImageComponent
                        url={v.get_presignedUrl}
                        objs={v.truck_list}
                      />
                    ))}
                  </Image.PreviewGroup>
                }
              >
                <CheckOutlined style={{ color: "green" }} />
              </Popover>
            ),
          };
        } else {
          return {
            children: <CloseOutlined style={{ color: "red" }} />,
          };
        }
      },
    });
  }
  function onChange(date, dateString) {
    setStartDate(dateString);
  }

  return (
    <div className="App">
      <PageHeader
        className="site-page-header"
        // onBack={() => null}
        title="Truck Tracking"
        // subTitle="This is a subtitle"
      />
      <Space direction="horizontal" size={12}>
        <Text strong>Select Date</Text>
        <DatePicker
          onChange={onChange}
          defaultValue={moment("2021-10-01", dateFormat)}
          format={dateFormat}
        />
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        scroll={{ y: "calc(100vh - 4em)", x: "100vw" }}
        size="large"
      ></Table>

      <Footer
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          backgroundColor: "grey",
          color: "Black",
          textAlign: "center",
        }}
      >
        Copyright 2022, All rights reserved &copy;
      </Footer>
    </div>
  );
}
export default App;
