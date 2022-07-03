import React, { Component } from 'react';

// components
import FullCalendar from '@fullcalendar/react';

// utils
import { isArray, isObject, isDate, merge } from "lodash";

// options
import { options } from 'shared-components/calendar/options';

import 'shared-components/calendar/style.css';

import moment from "moment";


export default class CityoneCalendar extends Component {

  constructor(props) {

    super(props);

    this.fullCalendar = React.createRef(null);

    const {
      service,
      method,
      urlPath,
      params,
      eventProps,
      calendarOptions
    } = merge(options, this.props.options)

    this.state = {
      service: service,
      method: method,
      urlPath: urlPath,
      params: params,
      eventProps: eventProps,
      calendarOptions: calendarOptions
    }

  }

  refresh = () => {
    if (this.fullCalendar && this.fullCalendar.current) {
      const fullCalendar = this.fullCalendar.current.getApi();
      if (fullCalendar)
        fullCalendar.refetchEvents();
    }
  }

  loadData = async (info, successCallback) => {
    let events = [];
    try {
      if (info && isDate(info.start)) {
        let apiResponse, apiResponseData, date = info.start, rows = [];

        if (this.state.service && this.state.method) {
          let year = date.getFullYear();
          let month = date.getMonth() + ((date.getDate() === 1) ? 1 : 2);

          if (month === 13) {
            month = "01";
            year = year + 1;
          }
          else if (month < 10) {
            month = "0" + month;
          }

          let payload = {
            month: month.toString(),
            year: year.toString()
          }

          apiResponse = await this.state.service[this.state.method]({ ...payload, ...this.state.params }, this.state.urlPath);

          if (apiResponse.data) {
            apiResponseData = apiResponse.data;
            if (!apiResponseData.isError) {
              let eventProps = this.state.eventProps;

              if (isArray(apiResponseData.data)) rows = apiResponseData.data;
              else if (isObject(apiResponseData.data)) rows = [apiResponseData.data];

              events = rows.map(row => {
                let title, start, end, url, event = {};
                let date = new Date()

                if (eventProps.title) {
                  title = (typeof eventProps.title === 'function') ? eventProps.title(row) : row[eventProps.title];
                  event.title = title;
                }
                if (eventProps.start) {
                  start = (typeof eventProps.start === 'function') ? eventProps.start(row) : row[eventProps.start];
                  event.start = start;
                  if (eventProps.type === "trainer" && (moment(new Date(event.start)) >= moment(date))) {
                    event.color = 'red'
                  }
                }
                if (eventProps.end) {
                  end = (typeof eventProps.end === 'function') ? eventProps.end(row) : row[eventProps.end];
                  event.end = end;
                }
                if (eventProps.url) {
                  url = (typeof eventProps.url === 'function') ? eventProps.url(row) : row[eventProps.url];
                  if (url) event.url = url;
                }
                event.extendedProps = row;

                return event;
              })

            }
          }
        }
      }
    }
    catch {
      console.log("Something went wrong.");
    }

    successCallback(events);
  }

  render() {
    return (
      <div>
        <div className="card cityone-calendar">
          <FullCalendar
            ref={this.fullCalendar}
            events={this.loadData}
            {...this.state.calendarOptions}
          />
        </div>
      </div>
    )
  }
}
