const { verifyToken } = require("../utils/Security.conf.js");
const { currentDate, convertToDateTime, diffTwoDateTime } = require("../utils/Common.conf.js");
const { FLAG, STATUS_CODES, STATUS_MESSAGE, ApiResponse } = require("../utils/ApiResponse.conf.js");

const auth = (req, res, next) => {
  let todayDate = currentDate();

  let authorization = req.headers.authorization || "";
  let result = verifyToken(authorization);

  let startTime = convertToDateTime(result.token_created_at);
  let endTime = convertToDateTime(todayDate);

  let data = diffTwoDateTime(endTime, startTime);

  if (data.minutes >= result.time) {
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.TIMEOUT, STATUS_MESSAGE.TIMEOUT, []));
  }
  req.body.auth_user_id = result.user_id;
  req.body.auth_user_type = result.user_type;
  next();
};

module.exports = {
  auth,
};
