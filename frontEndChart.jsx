//Frontend With React With Complete 3 Charts


import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Dropdown } from "primereact/dropdown";

import {
  Container,
  Row
} from "reactstrap";

import Header from "components/Headers/Header.js";

const Index = (props) => {
  const [statusData, setStatusData] = useState([])
  const [selecteChart, setSelecteChart] = useState("line");
  const [chartData1, setChartData1] = useState([]);
  const [year, setYear] = useState(2021);
  const [optionYear, setOptionYear] = useState([])

  const getData = async () => {
    const response = await fetch(`http://localhost:3002/user_display`)
    const res = await response.json()
    setStatusData(res.data.status);
  }

  const getChartData = async () => {
    const response = await fetch(`http://localhost:3002/charts/${year}`)
    const res = await response.json()
    setChartData1(res.data.chartMonthData);
    setOptionYear(res.data.userYearData)
  }

  const postYear = (e) => {
    setYear(e.target.value);
  }

  useEffect(() => {
    getData();
    getChartData();
  }, [year])

  const chartType = [
    { label: "Line Chart", value: "line" },
    { label: "Bar Chart", value: "bar" },
  ];

  handleChartChange
  const handleChartChange = (e) => {
    setSelecteChart(e.value);
  };

  const PieChart = () => {
    // Data for the pie chart
    const data1 = [
      { name: 'Active', y: statusData[0] },
      { name: 'Inactive', y: statusData[1] },
      { name: 'Disabled', y: statusData[2] },
    ];
    // Configure the options for the pie chart
    const options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'User Status',
      },
      series: [
        {
          name: 'Users',
          data: data1,
        },
      ],
    };
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };

  const LineChart = () => {
    const options = {
      chart: {
        type: "line",
      },
      title: {
        text: `Signup - Users of year ${year}`,
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

      },
      yAxis: {
        title: {
          text: "No. of Users",
        },
      },
      series: [
        {
          name: year,
          data: chartData1
        },
      ],
    };

    return <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  }

  const BarChart = () => {
    const chartOptionsBar = {
      chart: {
        type: selecteChart ? "column" : "bar",
      },
      title: {
        text: `Signup - Users of year ${year}`,
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      yAxis: {
        title: {
          text: "No. of Users",
        },
      },
      series: [
        {
          name: year,
          data: chartData1
        },
      ],
    };
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptionsBar} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <div className="chart-dropdown">
          <Dropdown
            value={selecteChart}
            options={chartType}
            onChange={handleChartChange}
            placeholder="Select a chart type"
          />
          <Dropdown
            value={year}
            options={optionYear}
            onChange={postYear}
          />
        </div>

        <Row>
          {selecteChart === "bar" && (
            BarChart()
          )}

          {selecteChart === "line" && (
            LineChart()
          )}
        </Row>
        <Row>
          {PieChart()}
        </Row>
      </Container>
    </>
  );
};

export default Index;
