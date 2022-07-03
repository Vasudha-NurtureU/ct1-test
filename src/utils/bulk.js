// utils 
import { toaster } from "utils/toaster";

// services
import BulkService from 'services/bulk/bulk.service';

const setBulkStatus = async (data) => {
  let apiResponse;

  try {
    const bulkService = new BulkService();
    apiResponse = await bulkService.bulkStatusUpdate(data.data);

    if (apiResponse && apiResponse.data) {
      const apiResponseData = apiResponse.data;

      if (!apiResponseData.isError) {
        toaster.success(data.success || apiResponseData.message || "Status updated successfully")
        if (data.dataTable && data.dataTable.current) {
          data.dataTable.current.loadData()
          data.dataTable.current.removeSelection()
        }
      } else {
        toaster.error(data.error || apiResponseData.message || "Status not updated")
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }

  return apiResponse;
}

const deleteBulkItems = async (data) => {
  let apiResponse;

  try {
    const bulkService = new BulkService()
    apiResponse = await bulkService.bulkDelete(data.data);

    if (apiResponse && apiResponse.data) {
      const apiResponseData = apiResponse.data;

      if (!apiResponseData.isError) {
        toaster.success(data.success || apiResponseData.message || "Deleted successfully")
        if (data.dataTable && data.dataTable.current) {
          data.dataTable.current.loadData()
          data.dataTable.current.removeSelection()
        }
      } else {
        toaster.error(data.error || apiResponseData.message || "Not deleted")
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }

  return apiResponse;
}

export const bulk = {
  setBulkStatus,
  deleteBulkItems
}