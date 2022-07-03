import React, { useState, useEffect } from "react";

// utils 

import { validations } from 'utils/validations';

import { isEmpty } from 'lodash';

import { response } from "utils/response";

import { getUserName } from "utils/common";

// shared components 
import CityoneDynamicForm from "shared-components/cityone-form/index";

// services 
import CategoryService from 'services/assets/category.service';

const CategoryForm = (props) => {

  // props destructure start
  const { initialValue, dataTableRef } = props;
  const { initValue, isEditable } = initialValue;
  // props destructure end

  // variable init start 
  const categoryService = new CategoryService()
  // variable init end

  // category form section start 

  // validations 

  const [categoryFormFields, setCategoryFormFields] = useState({
    label: {
      properties: {
        type: 'InputText',
        label: 'Category',
        primeFieldProps: {},
        validations: {
          required: validations.required,
        }
      }
    },
    parent_category_id: {
      properties: {
        type: 'Dropdown',
        label: 'Parent Category',
        primeFieldProps: {
          filter: true,
          options: [],
          showClear: true
        },
        validations: {
        }
      }
    },
    status_id: {
      properties: {
        type: 'Dropdown',
        label: 'Status',
        dropdownOptions: 'generalStatus',
        primeFieldProps: {
        },
        validations: {
          required: validations.required,
        }
      }
    },
  });

  // form submit 

  // form submit section start
  const categoryFormOnsubmit = (data, error) => {

    let formdata = {
      ...initValue,
      ...data
    }

    if (isEmpty(error)) {
      formdata = getUserName(isEditable, data)
      addCategory(formdata)
    }

  }

  // form submit section end

  // add new and update category section start

  const addCategory = async (data) => {

    if (!data.parent_category_id) {
      data.parent_category_id = 0
    }

    if (!isEditable) {
      await response.add({
        service: categoryService,
        method: 'addCategory',
        data: { item: data },
        dataTable: dataTableRef,
        toasterMessage: {
          success: 'Category added successfully',
          error: 'Category not added'
        }
      })
    } else {
      await response.update({
        service: categoryService,
        method: 'updateCategory',
        data: { itemId: initValue.asset_category_id, item: data },
        dataTable: dataTableRef,
        toasterMessage: {
          success: 'Category updated successfully',
          error: 'Category not updated'
        }
      })
    }

  }

  const getCategory = async () => {

    let params, categoryResponse, categoryResponseData, getCategoryList = [];

    try {
      params = { "first": 0, "rows": 100, "page": 1, "filters": {} };
      categoryResponse = await categoryService.getCategoryListDropDown({ lazyEvent: params })

      if (categoryResponse) {

        categoryResponseData = categoryResponse.data;

        if (categoryResponseData.data) {

          getCategoryList = categoryResponseData.data.filter(item => {
            return item;
          }).map(item => {
            return {
              label: item.label,
              value: item.asset_category_id,
            }
          })

          if (getCategoryList.length > 0) {
            setCategoryFormFields({
              ...categoryFormFields,
              parent_category_id: {
                ...categoryFormFields.parent_category_id,
                properties: {
                  ...categoryFormFields.parent_category_id.properties,
                  primeFieldProps: {
                    ...categoryFormFields.parent_category_id.properties.primeFieldProps,
                    options: getCategoryList
                  }
                }
              }
            })
          }

        }

      }
    } catch (err) {
      console.log(err)
    }
  }

  // add new and update category section end

  useEffect(() => {
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <CityoneDynamicForm initialValues={initValue} fields={categoryFormFields} onFormSubmit={categoryFormOnsubmit} />
    </div>
  );
}

export default CategoryForm;
