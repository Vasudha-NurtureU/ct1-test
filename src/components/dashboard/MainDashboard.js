import React, { Component } from 'react';

import { withRouter } from "react-router";

import { connect } from "react-redux";

// components
// shared components
import CityoneLoading from 'shared-components/lazyLoading/Loading';

import CityoneCard from 'shared-components/card';

import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';
import { statusBadge, packageBadge, bookingIdBadge } from "utils/badgeTemplate";

// utils 
import randomColor from 'randomcolor';

import buildBreadcrumb from "utils/breadcrumb";

// services
import DashboardService from 'services/dashboard/dashboard.service';

// constants
const initValue = {
  cardCounts: [0, 0, 0, 0, 0],

  barChartOptions: {
    scales: {
      xAxes: {
        stacked: true,
      },
      yAxes: {
        stacked: true,
        ticks: {
          beginAtZero: true,
          min: 0,
          callback: function (value, index, ticks) {
            return ((value / ticks[ticks.length - 1].value) * 100).toFixed(0) + '%';
          }
        }
      }
    }
  },

  barChartData: {
    labels: [],
    datasets: [
      {
        label: 'In Active',
        data: [],
        backgroundColor: '#ac40bf',
      },
      {
        label: 'Active',
        data: [],
        backgroundColor: '#98fb98',
      },
    ],
  },

  doughnutChartOptions: {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  },

  doughnutChartData: {
    labels: [],
    datasets: [
      {
        label: 'Event Type',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  },

  linearChartOptions: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          }
        }
      ]
    },
    plugins: {
      legend: {
        display: false
      }
    }
  },

  linearChartData: {
    labels: [],
    datasets: [
      {
        label: 'Record count',
        data: [],
        fill: false,
        backgroundColor: '#f6c23e',
        borderColor: '#f6c23e'
      }
    ]
  }
};

class MainDashboard extends Component {

  constructor(props) {

    super(props);

    // variable init start
    this.dashboardService = new DashboardService();

    this.unmounted = false;

    this.maxCenterSessions = 0;

    this.maxTrainerSessions = 0;
    // variable init end

    // state management start
    this.state = {

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
      ],

      loading: false,

      cards: [
        {
          title: "BOOKINGS",
          titleColor: "#4e73df",
          path: ""
        },
        {
          title: "ENQUIRES",
          titleColor: "#1cc88a",
          path: ""
        },
        {
          title: "CUSTOMERS",
          titleColor: "#36b9cc",
          path: ""
        },
        {
          title: "PACKAGES",
          titleColor: "#f6c23e",
          path: ""
        },
        {
          title: "DESTINATIONS",
          titleColor: "#4100ff8c",
          path: ""
        },
        {
          title: "TAGS",
          titleColor: "#1cc88a",
          path: ""
        },
      ],

      cardCounts: initValue.cardCounts,

      barChartOptions: initValue.barChartOptions,

      barChartData: initValue.barChartData,

      doughnutChartOptions: initValue.doughnutChartOptions,

      doughnutChartData: initValue.doughnutChartData,

      bookingsTableOptions: {
        tablePrimeConfig: {
          autoLayout: true,
          lazy: true,
          scrollable: true,
          scrollHeight: "500px",
          emptyMessage: 'No data found'
        },
        url: this.dashboardService,
        method: 'recentBookings', 
        params: {
          board: "center"
        },
        lazyParams: {
          sortField: "booking_id",
          sortOrder: -1
        },
        columns: [
          {
            header: 'Booking Id',
            field: 'booking_id',
            sortable: true,
            body: bookingIdBadge,
            headerStyle: {
              width: '110px'
            }
          },
          {
            header: 'Package',
            field: 'package_id',
            sortable: true,
            headerStyle: {
              width: '170px'
            },
            body: packageBadge
          },
          {
            header: 'Status',
            field: 'status_id',
            sortable: true,
            body: statusBadge,
            headerStyle: {
              width: '110px'
            }
          },
        ],
        pagination: {
          currentPageReport: {
            isPageResult: false,
            shortResult: true
          },
          rowsPerPageDropdown: {
            isRowPerPage: false
          }
        },
        actionBtnOptions: [
          {
            title: 'View Booking',
            onClick: (ev, rowdata) => {
              this.viewBooking(rowdata.booking_id)
            },
            icon: "pi pi-eye view-icon",
          },
          {
            type: 'delete',
            hide: true
          }
        ],
        toolBarBtnOptions: {
          visibility: false,
          title: 'Recent Bookings',
          rightBtnsOptions: [{ visibility: false }]
        }
      },

      enquiryTableOptions: {
        tablePrimeConfig: {
          autoLayout: true,
          lazy: true,
          scrollable: true,
          scrollHeight: "500px",
          emptyMessage: 'No data found'
        },
        url: this.dashboardService,
        method: 'recentEnquires',
        params: {
          board: "trainer"
        },
        lazyParams: {
          sortField: "id",
          sortOrder: -1
        },
        columns: [
          {
            header: 'Name',
            field: 'full_name',
            sortable: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Email Id',
            field: 'email_id',
            sortable: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Contact Number',
            field: 'contact_no',
            sortable: true,
            headerStyle: {
              width: '120px'
            },
            body: this.trainerSessionsTemplate
          }
        ],
        pagination: {
          currentPageReport: {
            isPageResult: false,
            shortResult: true
          },
          rowsPerPageDropdown: {
            isRowPerPage: false
          }
        },
        enableActionColumn: false,
        toolBarBtnOptions: {
          title: 'Recent Enquires',
          rightBtnsOptions: [{ visibility: false }]
        }
      },

      linearChartOptions: initValue.linearChartOptions,

      linearChartData: initValue.linearChartData

    }
    // state management end

  }

  viewBooking = (booking_id) => {
    this.props.history.push(`/bookings/details/${booking_id}`);
  }

  // dashboard data load section start
  loadData = async () => {
    let apiResponse, dashboardData, cardCounts, barChartOptions, barChartData, doughnutChartData, linearChartData;

    cardCounts = initValue.cardCounts;
    barChartOptions = initValue.barChartOptions;
    barChartData = initValue.barChartData;
    doughnutChartData = initValue.doughnutChartData;
    linearChartData = initValue.linearChartData;

    if (this.unmounted) return;
    this.setState({ loading: true });

    try {

      // cards data load section start
      if (this.unmounted) return;
      apiResponse = await this.dashboardService.getCountsOfCards();

      if (apiResponse && apiResponse.data && !apiResponse.data.isError && apiResponse.data.data) {
        dashboardData = apiResponse.data.data;

        cardCounts = [
          dashboardData.bookingsCount || 0,
          dashboardData.enquiresCount || 0,
          dashboardData.customersCount || 0,
          dashboardData.packagesCount || 0,
          dashboardData.destinationsCount || 0,
          dashboardData.tagsCount || 0,
        ];

      }
      // cards data load section end

      if (this.unmounted) return;
      apiResponse = await this.dashboardService.getCollegesPerState();

      if (apiResponse && apiResponse.data && !apiResponse.data.isError && apiResponse.data.data) {
        dashboardData = apiResponse.data.data;

        if (Array.isArray(dashboardData.labels) &&
          Array.isArray(dashboardData.inactiveCollege) &&
          Array.isArray(dashboardData.activeCollege) &&
          Number.isInteger(dashboardData.maxValue) &&
          (dashboardData.labels.length === dashboardData.inactiveCollege.length) &&
          (dashboardData.inactiveCollege.length === dashboardData.activeCollege.length)) {

          barChartOptions.scales.yAxes.ticks.max = dashboardData.maxValue;
          barChartOptions.scales.yAxes.ticks.stepSize = (dashboardData.maxValue / 4);
          barChartData.labels = dashboardData.labels;
          barChartData.datasets[0].data = dashboardData.inactiveCollege;
          barChartData.datasets[1].data = dashboardData.activeCollege;

        }
      }

      // event doughnut chart data load section start
      if (this.unmounted) return;
      apiResponse = await this.dashboardService.getEventTypes();

      if (apiResponse && apiResponse.data && !apiResponse.data.isError && apiResponse.data.data) {
        dashboardData = apiResponse.data.data;

        if (Array.isArray(dashboardData.labels) && Array.isArray(dashboardData.eventtypeData) && (dashboardData.labels.length === dashboardData.eventtypeData.length)) {

          const backgroundColors = dashboardData.eventtypeData.map(() => { return randomColor({ luminosity: 'light' }) });
          const borderColors = backgroundColors.map(color => { return randomColor({ luminosity: 'dark', hue: color }) });
          doughnutChartData.labels = dashboardData.labels;
          doughnutChartData.datasets[0].data = dashboardData.eventtypeData;
          doughnutChartData.datasets[0].backgroundColor = backgroundColors;
          doughnutChartData.datasets[0].borderColor = borderColors;

        }
      }
      // event doughnut chart data load section end

      // event linear chart data load section start
      if (this.unmounted) return;
      apiResponse = await this.dashboardService.getEventsByMonth();

      if (apiResponse && apiResponse.data && !apiResponse.data.isError && apiResponse.data.data) {
        dashboardData = apiResponse.data.data;

        if (Array.isArray(dashboardData.labels) && Array.isArray(dashboardData.totalSessions) && (dashboardData.labels.length === dashboardData.totalSessions.length)) {

          linearChartData.labels = dashboardData.labels;
          linearChartData.datasets[0].data = dashboardData.totalSessions;

        }
      }
      // event linear chart data load section end
    }
    catch {
      console.log("Something went wrong.");
    }

    if (this.unmounted) return;
    this.setState({
      cardCounts: cardCounts,
      barChartOptions: barChartOptions,
      barChartData: barChartData,
      doughnutChartData: doughnutChartData,
      linearChartData: linearChartData,
      loading: false
    });
  }
  // dashboard data load section end

  centerSessionsTemplate = (rowData, { field }) => {
    if (!this.maxCenterSessions && rowData[field])
      this.maxCenterSessions = rowData[field];
    return rowData[field]
      ?
      <div style={{ textAlign: "right", paddingRight: "4px", backgroundColor: `rgba(108, 213, 13, ${Math.max((rowData[field] / this.maxCenterSessions), 0.04)})` }}>
        {rowData[field]}
      </div>
      :
      <div style={{ textAlign: "right", backgroundColor: `rgba(108, 213, 13, 0.04)` }}> 0 </div>
  }

  trainerSessionsTemplate = (rowData, { field }) => {
    if (!this.maxTrainerSessions && rowData[field])
      this.maxTrainerSessions = rowData[field];
    return rowData[field]
      ?
      <div style={{ textAlign: "right", paddingRight: "4px", backgroundColor: `rgba(230, 34, 139, ${Math.max((rowData[field] / this.maxTrainerSessions), 0.04)})` }}>{rowData[field]}</div>
      :
      <div style={{ textAlign: "right", backgroundColor: `rgba(230, 34, 139, 0.04)` }}> 0 </div>
  }

  componentDidMount() {
    buildBreadcrumb(null, this.state.breadcrumbs);
    this.loadData();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    return (
      <>
        {this.state.loading === true ? <CityoneLoading /> : <></>}

        <div className='container p-mt-2'>

          <div className="p-grid p-jc-between">
            {
              this.state.cards.map((item, index) => {
                return <div className="p-col-12 p-md-4 p-my-2" key={index}>
                  <CityoneCard {...item} count={this.state.cardCounts[index] || 0} />
                </div>
              })
            }
          </div>

          <div className="p-grid p-mt-2">
            <div className="p-col-12 p-md-6">
              <div className="p-card">
                <CityoneDataTable options={this.state.bookingsTableOptions} />
              </div>
            </div>
            <div className="p-col-12 p-md-6">
              <div className="p-card">
                <CityoneDataTable options={this.state.enquiryTableOptions} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}


const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(MainDashboard));
