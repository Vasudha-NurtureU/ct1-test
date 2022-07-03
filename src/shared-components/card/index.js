import React, { Component } from 'react';

class CityoneCard extends Component {
  render() {
    // props destructure start
    const { className, titleColor, title, count, path } = this.props;
    // props destructure end

    return (
      <div className={"p-card dashboard-card " + (className || "")} style={{ borderLeftColor: (titleColor || "") }}>
        <div className="p-p-2 p-mb-2" style={{ color: (titleColor || "") }}> {title} </div>
        <div className="p-d-flex p-px-2 p-pb-2">
          <div className="p-text-bold dashboard-card-count"> {count} </div>
          {
            path
              ?
              <div style={{ float: 'right', marginLeft: 'auto' }}>
                <a href={path} className="dashboard-card-view"> View </a>
              </div>
              :
              <></>
          }
        </div>
      </div>
    )
  }
}

export default CityoneCard;