import React from 'react';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

const CityoneDataTablePagination = (pagination) => {

  const { prevPageLink, nextPageLink, pageLinks, rowsPerPageDropdown, currentPageReport } = pagination;

  return {

    layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport',

    'PrevPageLink': (options) => {
      if (!prevPageLink.isPrevPageLink)
        return <></>;
      else
        return (
          <div className="cityone-prev-page-link">
            <button type="button"
              className={`${options.className} ${(prevPageLink.classNames) ? prevPageLink.classNames : ''}`}
              onClick={options.onClick}
              disabled={options.disabled}
            >
              <span className="pi pi-chevron-left "></span>
            </button>
          </div>
        )
    },

    'NextPageLink': (options) => {
      if (!nextPageLink.isNextPageLink)
        return <></>;
      else
        return (
          <div className='cityone-next-page-link'>
            <button type="button"
              className={`${options.className} ${(nextPageLink.classNames) ? nextPageLink.classNames : ''}`}
              onClick={options.onClick}
              disabled={options.disabled}>
              <span className="pi pi-chevron-right "></span>
            </button>
          </div>
        )
    },

    'PageLinks': (options) => {
      if (
        (options.view.startPage === options.page && options.view.startPage !== 0) ||
        (options.view.endPage === options.page && options.page + 1 !== options.totalPages)
      ) {
        const className = classNames(options.className, { 'p-disabled': true }, (pageLinks.classNames) ? pageLinks.classNames : '');

        return <span className={className} style={{ userSelect: 'none' }}>...</span>;
      }

      return (
        <button type="button" className={options.className} onClick={options.onClick}>
          {options.page + 1}
        </button>
      )
    },

    'RowsPerPageDropdown': (options) => {
      if (!rowsPerPageDropdown.isRowPerPage)
        return <></>;
      else
        return (
          <div className={classNames(`cityone-page-dropdown ${rowsPerPageDropdown.classNames}`)}>
            <span>Rows per page</span>
            <Dropdown
              value={options.value}
              options={rowsPerPageDropdown.dropdownOptions}
              onChange={options.onChange}
              appendTo={document.body}
            />
          </div>
        )
    },

    // eslint-disable-next-line react/display-name
    'CurrentPageReport': (options) => {
      return (
        <div className='cityone-page-result'>
          <div className={currentPageReport.classNames}>
            {
              (currentPageReport.isPageResult) ?
                <span> Showing  {options.first} to {options.last} of {options.totalRecords} entries</span> :
                null
            }
            {
              (currentPageReport.shortResult) ?
                <span> {options.first}-{options.last}/{options.totalRecords} </span> :
                null
            }
            {
              (currentPageReport.isPageNavigator) ?
                <span className="p-mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                  Go to <InputText size="2" className="p-ml-1" value={this.state.currentPage} tooltip={this.state.pageInputTooltip}
                    onKeyDown={(e) => this.onPageInputKeyDown(e, options)} onChange={this.onPageInputChange} />
                </span> :
                null
            }
          </div>
        </div>
      )
    }
  };
}


export default CityoneDataTablePagination;