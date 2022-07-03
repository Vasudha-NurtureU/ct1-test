import React, { Component } from 'react';

// prime component 
import { AutoComplete } from 'primereact/autocomplete';

// service 
import AutoCompleteService  from 'services/autoComplete/autoComplete.service'

export class CityoneAutoComplete extends Component {

  constructor(props) {

    super(props);

    const { method } = this.props;

    this.state = {
      method : method,
      selectedItem: null,
      filteredItems: null,
    };

    this.searchItems = this.searchItems.bind(this);

    this.service = new AutoCompleteService();

  }

  setCountries = (searchValue) => {

    let payload =  { search : searchValue }

    this.service[this.state.method](payload)
    .then((res) => {
      this.setState({ filteredItems: res.data.data })
    });

  }

  searchItems(ev) {

    let searchValue = ev.query ;

    if(searchValue.length > 2) {
      setTimeout(() => {
        this.setCountries(ev.query)
      }, 500);
    } else {
      console.log("search value must be minimum 3 character...")
    }

  }

  render() {
    return (
      <div className="cityone-auto-complete">
        <AutoComplete
          value={this.state.selectedItem}
          suggestions={this.state.filteredItems}
          completeMethod={this.searchItems}
          field="label"
          onChange={(e) => this.setState({ selectedItem: e.value })}
        />
      </div>
    );
  }
}

export default CityoneAutoComplete;
