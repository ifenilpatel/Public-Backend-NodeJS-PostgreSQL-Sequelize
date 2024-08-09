const FLAG = {
  SUCCESS: 1,
  FAIL: 0,
};

const STATUS_CODES = {
  SUCCESS: 200,
  NO_DATA: 204,
  EXIST_DATA: 205,
  NEED_PARAM: 207,
  DATABASE_ERROR: 301,
  SYSTEM_ERROR: 302,
  UNAUTHORIZED: 601,
  ROUTE_NOT_FOUND: 901,
  LIMIT_EXHAUSTED: 501,
};

const STATUS_MESSAGE = {
  SUCCESS: "Data sent successfully!",
  INSERT: "Data inserted successfully!",
  UPDATE: "Data updated successfully!",
  DELETE: "Data deleted successfully!",
  NO_DATA: "No data found!",
  EXIST_DATA: "Data is already exist!",
  NEED_PARAM: "Please provide valid parameters!",
  DATABASE_ERROR: "Apologies for the inconvenience, we have issue with database!",
  SYSTEM_ERROR: "Apologies for the inconvenience, we have a issue with system!",
  UNAUTHORIZED: "You do not have access!",
  ROUTE_NOT_FOUND: "try again, route not found!",
  LIMIT_EXHAUSTED: "Too many requests, please try again later.",
};

class ApiResponse {
  constructor(flag, code, message, data) {
    this.flag = flag;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

module.exports = { ApiResponse, FLAG, STATUS_CODES, STATUS_MESSAGE };
