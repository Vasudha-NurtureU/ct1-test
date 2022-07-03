import React, { useEffect, useState, useRef, useCallback } from 'react';

// state
import { connect } from "react-redux";

// form
import { useForm, Controller } from 'react-hook-form';

// components
import Select from "react-select";

import PhoneInput from 'react-phone-input-2';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//prime components
import { InputText } from 'primereact/inputtext';

import { Password } from 'primereact/password';

import { InputTextarea } from 'primereact/inputtextarea';

import { Dropdown } from 'primereact/dropdown';

import { MultiSelect } from 'primereact/multiselect';

import { Checkbox } from 'primereact/checkbox';

import { InputSwitch } from 'primereact/inputswitch';

import { Slider } from 'primereact/slider';

import { Calendar } from 'primereact/calendar';

import { Chips } from 'primereact/chips';

import { AutoComplete } from 'primereact/autocomplete';

import { Button } from 'primereact/button';

// utils
import { isArray, isEmpty, isObject } from 'lodash';

import { classNames } from 'primereact/utils';

import { modalPopup } from 'utils/modalPopup';

// service
import DropdownService from 'services/dropdown/dropdown.service';

// config
import config from 'assets/config';

import ReactCrop from 'react-image-crop';

function CityoneDynamicForm({ initialValues, fields, onFormSubmit, submitButtonGroup, formConfig, dd }) {

  const closeModel = (
    <div className="form-button-group">
      <Button type="button" className='p-button p-button-secondary p-mr-2' label="Cancel" onClick={() => { modalPopup.toggle(false) }} > </Button>
      <Button type="submit" label="Submit" className="p-button p-button-primary" />
    </div>
  )

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();

  // autocomplete sections 
  const [filteredItems, setFilteredItems] = useState([]);
  const [upImg, setUpImg] = useState();
  const [fileName, setFilename] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: 'px', width: 150, height:150, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [result, setResult] = useState(null);
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    Object.keys(initialValues).forEach(key => {
      if (initialValues[key]) {
        if (fields[key]) {
          if (fields[key].properties.type === "SelectDropdown") {
            if (typeof initialValues[key] === "object")
              setValue(key, initialValues[key], { shouldValidate: true, shouldDirty: true });
          }
          else if (fields[key].properties.type === "MultiSelectDropdown") {
            if (Array.isArray(initialValues[key]) && !initialValues[key].find(option => (!option || typeof option !== "object")))
              setValue(key, initialValues[key], { shouldValidate: true, shouldDirty: true });
          }
          else
            setValue(key, initialValues[key], { shouldValidate: true, shouldDirty: true });
        }
        else
          setValue(key, initialValues[key], { shouldValidate: true, shouldDirty: true });
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'low';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    const base64Image = canvas.toDataURL("image/jpeg", 1);
    setResult(base64Image);
  }, [completedCrop]);

  const onSubmitForm = (data) => {
    let formData = {};

    Object.keys(data).forEach(key => {
      if (fields[key]) {
        if (fields[key].properties.type === "SelectDropdown") {
          if (data[key] && typeof data[key] === "object")
            formData[key] = data[key].value;
          else
            formData[key] = data[key];
        }
        else if (fields[key].properties.type === "MultiSelectDropdown") {
          if (Array.isArray(data[key]) && !data[key].find(option => (!option || typeof option !== "object")))
            formData[key] = data[key].map(option => option.value);
          else
            formData[key] = data[key];
        }
        else if (fields[key].properties.type === "imageCrop") {
          Object.assign(formData, { photo: result });
          Object.assign(formData, { photoName: fileName });
        }
        else
          formData[key] = data[key];
      }
      else
        formData[key] = data[key];
    });

    onFormSubmit(formData, errors);
  }


  const setAcItems = async (searchField, searchValue, service, method, type) => {

    let payload = { [searchField]: searchValue };

    if (type === "ac") {
      service[method](payload)
        .then((res) => {
          setFilteredItems(res.data.data);
        });
    }
    else {
      const filterValue = searchValue ? searchValue.trim().toLowerCase() : null;
      let suggestions = [];

      if (filterValue) {
        const params = {
          session: "74c576ef-7234-4f47-8b11-f8e41d247f3b",
          input: filterValue
        };
        const dropdownService = new DropdownService();
        let apiResponse;

        try {
          apiResponse = await dropdownService.getCachedCitySuggestions(filterValue[0]);
          let results = apiResponse.data.results;
          for (const item of results) {
            if (item.active && item.name.toLowerCase().startsWith(filterValue)) {
              suggestions.push(item);
              if (suggestions.length === 20)
                break;
            }
          }

          if (suggestions.length === 0) {
            try {
              apiResponse = await dropdownService.getCityDetails(params);
              suggestions = apiResponse.data;
            }
            catch {
              console.log("Something went wong.");
            }
          }
        }
        catch {
          try {
            apiResponse = await dropdownService.getCityDetails(params);
            suggestions = apiResponse.data;
          }
          catch {
            console.log("Something went wong.");
          }
        }

        setFilteredItems(suggestions || []);
      }

    }

  }

  const searchAcItems = (ev, searchField, service, method, type) => {
    let searchValue = ev.query;

    if (searchValue.length > 2) {
      setTimeout(() => {
        setAcItems(searchField, searchValue, service, method, type)
      }, 500);
    }

  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFilename(e.target.files[0].name)
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (

    <form onSubmit={handleSubmit(onSubmitForm)}
      className={`form-wrapper ${formConfig ? formConfig.formClassName : ''}`}
      autoComplete={`${formConfig ? formConfig.autoComplete : 'on'}`}
    >

      <div className={`p-fluid form-section p-d-flex p-flex-wrap ${formConfig ? formConfig.formSectionClassName : ''}`}>
        {
          Object.keys(fields).map((key, index) => {

            const { properties } = fields[key];

            let primeFieldProps, validations;

            if (properties.primeFieldProps) {
              primeFieldProps = properties.primeFieldProps;
            } else {
              primeFieldProps = {}
            }

            if (properties.validations) {
              validations = properties.validations;
            } else {
              validations = {}
            }

            return (

              (properties.visibility === false) ? <React.Fragment key={key}></React.Fragment> : <React.Fragment key={key}>

                <div className={`p-field-wrapper p-col-12 ${properties.fieldWrapperClassNames ? properties.fieldWrapperClassNames : ''}`} key={key + index}>

                  <label htmlFor="lastname1" className={`p-field-label ${properties.fieldLabelClassNames ? properties.fieldLabelClassNames : ''}`}>
                    {
                      (validations && validations.required && validations.required.value) ? <em>*&nbsp;</em> : <></>
                    }
                    {properties.label}
                    {properties.tooltip ? <span className="tooltip-icon" title={properties.tooltip} > <i className="uil uil-info-circle"></i> </span> : <></>}
                  </label>

                  <div className={`p-field-section ${properties.fieldSectionClassNames ? properties.fieldSectionClassNames : ''}`}>
                    {(() => {

                      switch (properties.type) {

                        case "InputText":
                          return <InputText {...primeFieldProps} className={classNames({ 'p-invalid': errors[key] })} name={key} {...register(key, validations)} />

                        case "Password":
                          return <Password {...primeFieldProps} className={classNames({ 'p-invalid': errors[key] })} name={key} {...register(key, validations)} />

                        case "InputTextarea":
                          return <InputTextarea {...primeFieldProps} className={classNames({ 'p-invalid': errors[key] })} name={key} {...register(key, validations)} />

                        case "Dropdown":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={(props) => {
                              return <Dropdown
                                className={classNames({ 'p-invalid': errors[key] })}
                                {...primeFieldProps}
                                name={props.field.name}
                                value={props.field.value}
                                filter={false}
                                onChange={(e) => {
                                  props.field.onChange(e.value);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                                optionLabel="label" optionValue="value"
                                options={!isEmpty(properties.dropdownOptions) && Array.isArray(dd[properties.dropdownOptions]) ? dd[properties.dropdownOptions] : primeFieldProps.options}
                                inputRef={props.field.ref} />
                            }} />)

                        case "SelectDropdown":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={({ field: { onChange, value, name }, fieldState: { isDirty } }) => {
                              let fieldValue = null;
                              let isLoading = false;

                              if (!isDirty) {
                                if ((value === null) && (initialValues[key])) {
                                  let options = [];
                                  if (properties.dropdownOptions && Array.isArray(dd[properties.dropdownOptions]))
                                    options = dd[properties.dropdownOptions];
                                  else if (Array.isArray(primeFieldProps.options))
                                    options = primeFieldProps.options;

                                  fieldValue = options.find(option => option.value === initialValues[key]);

                                  if (fieldValue)
                                    onChange(fieldValue);
                                  else
                                    isLoading = true;
                                }
                              }

                              return <Select
                                className={classNames({ 'p-invalid': errors[key] })}
                                {...primeFieldProps}
                                name={name}
                                value={value || fieldValue}
                                isLoading={isLoading}
                                loadingMessage={() => "No data found"}
                                placeholder={isLoading ? "Loading..." : (primeFieldProps.placeholder || "")}
                                isClearable={primeFieldProps.isClearable || primeFieldProps.showClear}
                                isDisabled={primeFieldProps.isDisabled || primeFieldProps.readOnly}
                                isSearchable={primeFieldProps.isSearchable || primeFieldProps.filter}
                                formatOptionLabel={primeFieldProps.formatOptionLabel || primeFieldProps.itemTemplate}
                                noOptionsMessage={primeFieldProps.noOptionsMessage || (() => "No data found")}
                                onChange={(value) => {
                                  onChange(value);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(value, setValue);
                                  }
                                }}
                                options={!isEmpty(properties.dropdownOptions) && Array.isArray(dd[properties.dropdownOptions]) ? dd[properties.dropdownOptions] : primeFieldProps.options}
                              />
                            }} />)

                        case "MultiSelect":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={(props) => {
                              return <MultiSelect
                                className={classNames({ 'p-invalid': errors[key] })}
                                {...primeFieldProps}
                                name={props.field.name}
                                value={props.field.value}
                                filter={false}
                                onChange={(e) => {
                                  props.field.onChange(e.value);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                                optionLabel="label" optionValue="value"
                                options={!isEmpty(properties.dropdownOptions) && Array.isArray(dd[properties.dropdownOptions]) ? dd[properties.dropdownOptions] : primeFieldProps.options}
                                inputRef={props.field.ref} />
                            }} />)

                        case "MultiSelectDropdown":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={({ field: { onChange, value, name }, fieldState: { isDirty } }) => {
                              let fieldValue = [];
                              let isLoading = false;

                              if (!isDirty) {
                                if (Array.isArray(initialValues[key]) &&
                                  (initialValues[key].length > 0) &&
                                  ((value === null) || (Array.isArray(value) && value.length !== initialValues[key].length)) &&
                                  initialValues[key].find(option => (!option || typeof option !== "object"))) {
                                  let options = [];

                                  if (properties.dropdownOptions && Array.isArray(dd[properties.dropdownOptions]))
                                    options = dd[properties.dropdownOptions];
                                  else if (Array.isArray(primeFieldProps.options))
                                    options = primeFieldProps.options;

                                  fieldValue = initialValues[key].map(selectedValue => options.find(option => option.value === selectedValue)).filter(option => option);

                                  if (fieldValue.length === initialValues[key].length) {
                                    onChange(fieldValue);
                                  }
                                  else if (fieldValue.length > 0) {
                                    onChange(fieldValue);
                                  }
                                  else {
                                    isLoading = true;
                                  }
                                }
                              }

                              return <Select
                                className={classNames({ 'p-invalid': errors[key] })}
                                {...primeFieldProps}
                                name={name}
                                value={value || fieldValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                loadingMessage={() => "No data found"}
                                isLoading={isLoading}
                                placeholder={isLoading ? "Loading..." : (primeFieldProps.placeholder || "")}
                                isClearable={primeFieldProps.isClearable || primeFieldProps.showClear}
                                isDisabled={primeFieldProps.isDisabled || primeFieldProps.readOnly}
                                isSearchable={primeFieldProps.isSearchable || primeFieldProps.filter}
                                formatOptionLabel={primeFieldProps.formatOptionLabel || primeFieldProps.itemTemplate}
                                noOptionsMessage={primeFieldProps.noOptionsMessage || (() => "No data found")}
                                onChange={(value) => {
                                  onChange(value);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(value, setValue);
                                  }
                                }}
                                options={!isEmpty(properties.dropdownOptions) && Array.isArray(dd[properties.dropdownOptions]) ? dd[properties.dropdownOptions] : primeFieldProps.options}
                              />
                            }} />)

                        case "Checkbox":
                          return (<div>
                            <Controller name={key} control={control} rules={validations} render={(props) => (
                              <Checkbox className={classNames({ 'p-invalid': errors[key] })} {...primeFieldProps} inputId={key}
                                onChange={(e) => {
                                  props.field.onChange(e.checked);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                                checked={props.field.value} />
                            )} />
                            <label htmlFor={key} className="p-checkbox-label">{properties.label}</label>
                          </div>)

                        case "RadioButton":

                          if (properties.items) {
                            return properties.items.map((item) => {
                              return (
                                <div key={item.key} className="p-field-radiobutton">
                                  <Controller className={classNames({ 'p-invalid': errors[key] })} name={key} control={control} rules={validations} render={(props) => {
                                    return (
                                      <input type='radio' id={item.key} value={item.key} name={key} {...primeFieldProps}
                                        onClick={(e) => {
                                          props.field.onChange(e.target.value);
                                          if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                            primeFieldProps.onChange(e, setValue);
                                          }
                                        }}
                                      />
                                    )
                                  }} />
                                  <label htmlFor={item.key}>{item.name}</label>
                                </div>
                              )
                            })
                          }

                          break;

                        case "InputSwitch":
                          return (<div>
                            <Controller name={key} control={control} rules={validations} render={(props) => (
                              <InputSwitch {...primeFieldProps} inputId={key}
                                onChange={(e) => {
                                  props.field.onChange(e.value);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                                checked={props.field.value} />
                            )} />
                          </div>)

                        case "FileUpload":
                          if (!validations.validate) {
                            let maxAllowedFileSize = properties.maxFileSize || config.maxAllowedFileSize;
                            if (maxAllowedFileSize) {
                              let fileSizeError = properties.fileSizeError || `Selected file size is greater than allowed file size`;
                              validations.validate = value => {
                                return (!isEmpty(value) && value[0].size && value[0].size > (maxAllowedFileSize * 1024 * 1024)) ? fileSizeError : true;
                              }
                            }
                          }
                          return <InputText className={classNames({ 'p-invalid': errors[key] })} type="file" {...primeFieldProps} name={key} {...register(key, validations)}
                            onChange={(e) => { onSelectFile(e) }} />
                        case "ProfileUpload":
                          if (!validations.validate) {
                            let maxAllowedFileSize = properties.maxFileSize || config.profileImageMaxFIleSize;
                            if (maxAllowedFileSize) {
                              let fileSizeError = properties.fileSizeError || `Selected file size is greater than allowed file size`;
                              validations.validate = value => {
                                return (!isEmpty(value) && value[0].size && value[0].size > (maxAllowedFileSize * 1024 * 1024)) ? fileSizeError : true;
                              }
                            }
                          }
                          return <InputText className={classNames({ 'p-invalid': errors[key] })} type="file" {...primeFieldProps} name={key} {...register(key, validations)}
                            onChange={(e) => {
                              if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                primeFieldProps.onChange(e);
                              } 
                              onSelectFile(e) }} />

                        case "Slider":
                          return <div>
                            <Slider {...primeFieldProps} onSlideEnd={(ev) => { setValue(key, ev.value) }} />
                            <InputText type="hidden" name={key} {...register(key, validations)} />
                          </div>

                        case "Calendar":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={(props) => {
                              return <Calendar className={classNames({ 'p-invalid': errors[key] })} {...primeFieldProps} name={props.field.name} value={props.field.value}
                                onChange={(e) => {
                                  props.field.onChange(e.value);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                                optionLabel="label" optionValue="value"
                                inputRef={props.field.ref} />
                            }} />)

                        case "Chips":
                          return (<div>
                            <Controller name={key} control={control} rules={validations} render={(props) => (
                              <Chips className={classNames({ 'p-invalid': errors[key] })}
                                onChange={(e) => {
                                  props.field.onChange(e.value);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                              />
                            )} />
                            <label htmlFor={key} className="p-checkbox-label">{properties.label}</label>
                          </div>)


                        case "RichTextEditor":
                          return (<div>
                            <Controller name={key} control={control} rules={validations} render={(props) => (
                              <CKEditor
                                editor={ClassicEditor}
                                className={classNames({ 'p-invalid': errors[key] })}
                                onReady={editor => {
                                  if (props.field.value)
                                    editor.setData(props.field.value)
                                }}
                                name={props.field.name}
                                onChange={(event, editor) => {
                                  const richTextdata = editor.getData();
                                  props.field.onChange(richTextdata);
                                }}
                                {...primeFieldProps}
                                inputRef={props.field.ref}
                              />
                            )} />
                          </div>)

                        case "PhoneInput":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={(props) => {
                              return <PhoneInput
                                className={classNames({ 'p-invalid': errors[key] })}
                                country={'in'}
                                value={props.field.value}
                                name={props.field.name}
                                {...primeFieldProps}
                                onChange={(value, country, e, formattedValue) => {
                                  props.field.onChange(formattedValue);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(value, country, e, formattedValue, setValue);
                                  }
                                }}
                                inputRef={props.field.ref} />
                            }} />)

                        case "imageCrop":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={(props) => {
                              return <ReactCrop
                                src={upImg}
                                locked ={true}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={(e) => {
                                  setCrop(e)
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }
                                }
                                onComplete={(c) => setCompletedCrop(c)}
                                inputRef={props.field.ref} />
                            }} />
                          )

                        case "previewImage":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={() => {
                              return <div className="p-md-6">
                                <canvas
                                  ref={previewCanvasRef}
                                  style={{
                                    width: Math.round(completedCrop?.width ?? 0),
                                    height: Math.round(completedCrop?.height ?? 0)
                                  }}
                                />

                              </div>
                            }} />)

                        case "AutoComplete":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={(props) => {
                              return <AutoComplete
                                className={classNames({ 'p-invalid': errors[key] })}
                                {...primeFieldProps}
                                autoComplete="off"
                                name={props.field.name}
                                value={props.field.value}
                                suggestions={filteredItems}
                                completeMethod={(ev) => {
                                  searchAcItems(ev, properties.searchField, properties.service, properties.method, "ac")
                                }}
                                onChange={(e) => {

                                  if (isObject(e.value)) {
                                    props.field.onChange(e.value[properties.fieldLabel]);
                                  } else {
                                    props.field.onChange(e.value);
                                  }

                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                                field={properties.fieldLabel}
                                inputRef={props.field.ref} />
                            }} />)
                        case "StateAutoComplete":
                          return (<Controller control={control} rules={validations} name={key} defaultValue={null}
                            render={(props) => {
                              return <AutoComplete
                                className={classNames({ 'p-invalid': errors[key] })}
                                {...primeFieldProps}
                                autoComplete="off"
                                name={props.field.name}
                                value={props.field.value}
                                suggestions={filteredItems}
                                completeMethod={(ev) => {
                                  searchAcItems(ev, properties.searchField, properties.service, properties.method, "cac")
                                }}
                                onChange={(e) => {

                                  if (isObject(e.value)) {
                                    props.field.onChange(e.value[properties.fieldLabel]);
                                  } else {
                                    props.field.onChange(e.value);
                                  }

                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                                field={properties.fieldLabel}
                                inputRef={props.field.ref} />
                            }} />)

                        case "CityAutoComplete":
                          return (
                            <Controller control={control} rules={validations} name={key} defaultValue={null}
                              render={(props) => {
                                return <AutoComplete
                                  className={classNames({ 'p-invalid': errors[key] })}
                                  {...primeFieldProps}
                                  autoComplete="off"
                                  name={props.field.name}
                                  value={props.field.value}
                                  suggestions={filteredItems}
                                  completeMethod={(ev) => { searchAcItems(ev, properties.searchField, properties.service, properties.method, "cac"); }}
                                  onChange={(e) => {

                                    if (isObject(e.value)) {
                                      props.field.onChange(e.value[properties.fieldLabel]);
                                    } else {
                                      props.field.onChange(e.value);
                                    }

                                    if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                      primeFieldProps.onChange(e, setValue);
                                    }

                                    if (isObject(e.value)) {

                                      let fieldValue, options = [], countryID = [];

                                      options = !isEmpty(properties.countryField.dropdownOptions) && !isEmpty(dd[properties.countryField.dropdownOptions]) ?
                                        dd[properties.countryField.dropdownOptions] : properties.countryField.primeFieldProps.options;

                                      if (isArray(options)) {
                                        countryID = options.filter(item => {
                                          return item.label === e.value.country;
                                        })
                                        if (isArray(countryID) && countryID.length > 0) {
                                          fieldValue = countryID[0].value;
                                        }
                                      }
                                      setValue(properties.stateField.fieldName, e.value.state, { shouldValidate: true, shouldDirty: true });
                                      setValue(properties.countryField.fieldName, fieldValue, { shouldValidate: true, shouldDirty: true });
                                    }


                                  }}
                                  field={properties.fieldLabel}
                                  inputRef={props.field.ref} />

                              }} />
                          )

                        default:
                          return <>Form field not available</>

                      }
                    })()}
                  </div>

                  <div className={`p-error-section ${properties.fieldErrorClassNames ? properties.fieldErrorClassNames : ''}`}>
                    {errors[key] && (<span role="alert" className="error"> {errors[key].message} </span>)}
                  </div>

                  {
                    properties.hint
                      ?
                      <div className={`p-hint-section ${properties.fieldHintClassNames ? properties.fieldHintClassNames : ''}`}>
                        {properties.hint}
                      </div>
                      :
                      <></>
                  }

                </div>

                {
                  (properties.type === "CityAutoComplete") ?
                    <>

                      <div
                        className={`p-field-wrapper p-col-12 ${properties.stateField.fieldWrapperClassNames ? properties.stateField.fieldWrapperClassNames : ''}`}
                        key={properties.stateField.fieldName + index}>
                        <label htmlFor="lastname1"
                          className={`p-field-label ${properties.stateField.fieldLabelClassNames ? properties.stateField.fieldLabelClassNames : ''}`}>
                          {(properties.stateField.validations
                            && properties.stateField.validations.required
                            && properties.stateField.validations.required.value) ? <em>*&nbsp;</em> : <></>}
                          {properties.stateField.label}
                          {properties.stateField.tooltip ? <span className="tooltip-icon" title={properties.stateField.tooltip} > <i className="uil uil-info-circle"></i> </span> : <></>}
                        </label>
                        <div className={`p-field-section ${properties.stateField.fieldSectionClassNames ? properties.stateField.fieldSectionClassNames : ''}`}>
                          <InputText className={classNames({ 'p-invalid': errors[properties.stateField.fieldName] })}
                            name={properties.stateField.fieldName}
                            {...properties.stateField.primeFieldProps}
                            {...register(properties.stateField.fieldName, properties.stateField.validations)} />
                        </div>
                        <div className={`p-error-section ${properties.stateField.fieldErrorClassNames ? properties.stateField.fieldErrorClassNames : ''}`}>
                          {errors[properties.stateField.fieldName] && (<span role="alert" className="error"> {errors[properties.stateField.fieldName].message} </span>)}
                        </div>
                      </div>

                      <div
                        className={`p-field-wrapper p-col-12 ${properties.countryField.fieldWrapperClassNames ? properties.countryField.fieldWrapperClassNames : ''}`}
                        key={properties.countryField.fieldName + index}>
                        <label htmlFor="lastname1"
                          className={`p-field-label ${properties.countryField.fieldLabelClassNames ? properties.countryField.fieldLabelClassNames : ''}`}>
                          {(properties.countryField.validations
                            && properties.countryField.validations.required
                            && properties.countryField.validations.required.value) ? <em>*&nbsp;</em> : <></>}
                          {properties.countryField.label}
                          {properties.countryField.tooltip ? <span className="tooltip-icon" title={properties.countryField.tooltip} > <i className="uil uil-info-circle"></i> </span> : <></>}
                        </label>
                        <div className={`p-field-section ${properties.countryField.fieldSectionClassNames ? properties.countryField.fieldSectionClassNames : ''}`}>

                          <Controller control={control} rules={properties.countryField.validations} name={properties.countryField.fieldName} defaultValue={null}
                            render={(props) => {

                              let options = [];

                              options = !isEmpty(properties.countryField.dropdownOptions) && !isEmpty(dd[properties.countryField.dropdownOptions]) ? dd[properties.countryField.dropdownOptions] : properties.countryField.primeFieldProps.options;

                              return <Dropdown
                                className={classNames({ 'p-invalid': errors[properties.countryField.fieldName] })}
                                name={props.field.name}
                                value={props.field.value}
                                {...properties.countryField.primeFieldProps}
                                filter={false}
                                onChange={(e) => {
                                  props.field.onChange(e.value);
                                  if (primeFieldProps && primeFieldProps.onChange && typeof primeFieldProps.onChange === 'function') {
                                    primeFieldProps.onChange(e, setValue);
                                  }
                                }}
                                optionLabel="label" optionValue="value"
                                options={options}
                                inputRef={props.field.ref} />
                            }} />

                        </div>
                        <div className={`p-error-section ${properties.countryField.fieldErrorClassNames ? properties.countryField.fieldErrorClassNames : ''}`}>
                          {errors[properties.countryField.fieldName] && (<span role="alert" className="error"> {errors[properties.countryField.fieldName].message} </span>)}
                        </div>
                      </div>

                    </>
                    :
                    <></>
                }

              </React.Fragment>

            )

          })
        }

      </div>

      {(submitButtonGroup && typeof submitButtonGroup === 'function') ? submitButtonGroup() : closeModel}

    </form>
  )
}

const mapStateToProps = (state) => ({
  dd: state.dropdownDetails,
});

export default connect(mapStateToProps)(CityoneDynamicForm);