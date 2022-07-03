import React, { useState, useEffect } from "react";

// utils 
import { validations } from 'utils/validations';

import { isEmpty } from 'lodash';

import { response } from "utils/response";

import { getUserName } from "utils/common";

// shared components 
import CityoneLoading from 'shared-components/lazyLoading/Loading';

import CityoneDynamicForm from "shared-components/cityone-form/index";

// services 
import AssetsService from 'services/assets/assets.service';

import CategoryService from 'services/assets/category.service';

// config
import config from 'assets/config';

const AssetsForm = (props) => {

  // props destructure start
  const { initialValue, dataTableRef } = props;
  const { initValue, isEditable } = initialValue;
  // props destructure end

  // variable init start 
  const assetsService = new AssetsService();
  const categoryService = new CategoryService();
  // variable init end

  // state management start
  const [assetsFormFields, setAssetsFormFields] = useState({
    label: {
      properties: {
        type: 'InputText',
        label: 'Name',
        primeFieldProps: {},
        validations: {
          required: validations.required,
        }
      }
    },

    description: {
      properties: {
        type: 'InputTextarea',
        label: 'Description',
        primeFieldProps: {},
        validations: {
          required: validations.required,
        }
      }
    },

    asset_category_id: {
      properties: {
        type: 'Dropdown',
        label: 'Category',
        primeFieldProps: {
          filter: true,
          options: []
        },
        validations: {
          required: validations.required,
        }
      }
    },

    file: {
      properties: {
        type: 'FileUpload',
        label: 'File',
        visibility: !isEditable,
        hint: `Maximum allowed file size is ${config.maxAllowedFileSize}MB`,
        primeFieldProps: {},
        validations: {
          required: validations.required,
        }
      }
    },
    status_id: {
      properties: {
        type: 'Dropdown',
        label: 'Status',
        primeFieldProps: {
          options: [
            { label: "Active", value: 1 },
            { label: "In Active", value: 2 },
          ]
        },
        validations: {
          required: validations.required,
        }
      }
    },
  });

  const [loader, setLoader] = useState(false);
  // state management end

  // form submit section start
  const assetsFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      setLoader(true);
      let formData = { ...initValue, ...data }
      formData = getUserName(isEditable, formData);
      addUpdateAssets(formData);
    }

  }

  // add new and update assets section start
  const addUpdateAssets = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach(key => {
        (!isEditable && key === "file") ? formData.append(key, data[key][0]) : formData.append(key, data[key]);
      });

      if (isEditable) {
        formData.append("_method", "PUT");
        formData.delete('file')
      }

      if (!isEditable) {
        await response.add({
          service: assetsService,
          method: 'addAsset',
          data: { item: formData },
          dataTable: dataTableRef,
          toasterMessage: {
            success: 'Asset created successfully',
            error: 'Asset not created'
          }
        })
      } else {
        await response.update({
          service: assetsService,
          method: 'updateAsset',
          data: { itemId: initValue.asset_id, item: formData },
          dataTable: dataTableRef,
          toasterMessage: {
            success: 'Asset updated successfully',
            error: 'Asset not updated'
          }
        })
      }
    }
    catch {
      console.log("Something went wrong.");
    }

    setLoader(false);
  }
  // add new and update assets section end
  // form submit section end

  const getCategory = async () => {
    let getCategoryList;

    try {

      getCategoryList = await response.getList({
        service: categoryService,
        method: 'getCategoryListDropDown',
      })

      getCategoryList = getCategoryList.data.data.filter(item => {
        return item;
      }).map(item => {
        return {
          label: item.label,
          value: item.asset_category_id,
        }
      })

      if (getCategoryList.length > 0) {
        setAssetsFormFields({
          ...assetsFormFields,
          asset_category_id: {
            ...assetsFormFields.asset_category_id,
            properties: {
              ...assetsFormFields.asset_category_id.properties,
              primeFieldProps: {
                ...assetsFormFields.asset_category_id.properties.primeFieldProps,
                options: getCategoryList
              }
            }
          }
        })
      }
    } catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {
    getCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loader === true ? <CityoneLoading /> : <></>}
      <div>
        <CityoneDynamicForm initialValues={initValue} fields={assetsFormFields} onFormSubmit={assetsFormOnsubmit} > </CityoneDynamicForm>
      </div>
    </>
  )
}

export default AssetsForm;
