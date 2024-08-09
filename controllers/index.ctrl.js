const { ApiResponse } = require("../configuration/utils/ApiResponse.conf.js");
const { flag, statusCode } = require("../configuration/utils/Constant.conf.js");

const fun_Index = (request, response) => {
    response.json(new ApiResponse(flag.success, statusCode.success, "This application is working now!", []));
};

module.exports = { fun_Index };
