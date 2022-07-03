import React, { Component } from 'react';
import { Doughnut, Line, Pie, Bar } from 'react-chartjs-2';
export default class CityoneChart extends Component {

  constructor(props) {

    super(props);

    this.state = {
    }
  }
  chartDataLoad =async()=>{
    this.setState({
      doughnutChart: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    })
    try {
      if (this.props.userStatics.url && this.props.userStatics.method) {
  
        let tableResponse;
  
     
          tableResponse = await this.props.userStatics.service[this.props.userStatics.method]();
  
        if (tableResponse.data) {
          this.setState({
            totalRecords: parseInt(tableResponse.data.count),
            data: tableResponse.data.data,
            loading: false
          })
        }
        else {
          this.setState({ loading: false });
        }  
      }
    }
    catch {
      this.setState({ loading: false });
    }
  }
  componentDidMount(){
    this.chartDataLoad()
  }
  render() {

    return (<>
      {this.props.type === "Doughnut" ?
        <Doughnut data={this.props.doughdata} options={this.props.options} /> : null}
      {this.props.type === "line" ?
        <Line data={this.props.data} options={this.props.options} /> : null}
      {this.props.type === "Pie" ?
        <Pie data={this.props.trainerData} /> : null}
      {this.props.type === "Bar" ?
        <Bar data={this.props.barData} options={this.props.baroptions} /> : null}
    </>
    )
  }
}
