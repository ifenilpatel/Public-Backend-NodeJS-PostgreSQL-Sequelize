const flag = {
  success: 1,
  fail: 0,
};

const status = {
  success: 200,
  noData: 204,
  existData: 205,
  hasParent: 206,
  validPera: 207,
  databaseError: 301,
  systemError: 302,
  unAuthorized: 601,
  timeOut: 701,
  failed: 801,
  route: 901,
};

const statusCode = {
  success: "Data sent successfully!",
  insert: "Data inserted successfully!",
  update: "Data updated successfully!",
  delete: "Data deleted successfully!",
  noData: "No data found!",
  existData: "Data is already exist!",
  hasParent: "Can not remove this record!",
  validPera: "Please provide valid parameters!",
  databaseError: "Apologies for the inconvenience, we have issue with database!",
  systemError: "Apologies for the inconvenience, we have a issue with system!",
  unAuthorized: "You do not have access!",
  timeOut: "Timeout!",
  route: "try again, route not found!",
};

const PAGINATION_INPUT = {
  PAGE_INDEX: 1,
  PAGE_SIZE: 15,
};

module.exports = { flag, status, statusCode, PAGINATION_INPUT };
