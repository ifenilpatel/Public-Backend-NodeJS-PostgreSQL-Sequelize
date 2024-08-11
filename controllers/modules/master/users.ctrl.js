const { ApiResponse, FLAG, STATUS_CODES, STATUS_MESSAGE } = require("../../../configuration/utils/ApiResponse.conf.js");

const { PAGINATION_INPUT } = require("../../../configuration/utils/Constant.conf.js");

const User = require("../../../models/users.model.js");

const fun_SelectById = async (req, res) => {
  try {
    const user_id = req.body.user_id || 0;
    const result = await User.findOne({ where: { user_id: user_id } });
    if (!result) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    } else {
      return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.SUCCESS, result));
    }
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_SelectAll = async (req, res) => {
  try {
    let pageIndex = req.body.pageIndex || PAGINATION_INPUT.PAGE_INDEX;
    let pageSize = req.body.pageSize || PAGINATION_INPUT.PAGE_SIZE;
    // Calculate the offset
    const offset = (pageIndex - 1) * pageSize;
    // Fetch Users with pagination
    const Users = await User.findAndCountAll({
      limit: pageSize,
      offset: offset,
    });

    if (Users.count == 0) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    } else {
      return res.json(
        new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.SUCCESS, {
          records: Users.rows,
          totalRecords: Users.count,
        })
      );
    }
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_DeleteById = async (req, res) => {
  try {
    const user_id = req.body.user_id || 0;
    const result = await User.destroy({ where: { user_id: user_id } });
    if (!result) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.DELETE, result));
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_Insert = async (req, res) => {
  try {
    const { first_name, last_name, email_id, mobile, user_type, is_active, created_by } = req.body;
    const result = await User.create({ first_name, last_name, email_id, mobile, user_type, is_active, created_by });
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.INSERT, result));
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_Update = async (req, res) => {
  try {
    const { user_id, first_name, last_name, email_id, mobile, user_type, is_active, created_by } = req.body;
    const [result] = await User.update(
      { first_name, last_name, email_id, mobile, user_type, is_active, created_by },
      {
        where: { user_id },
      }
    );
    if (!result) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.UPDATE, result));
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

module.exports = {
  fun_SelectById,
  fun_SelectAll,
  fun_DeleteById,
  fun_Insert,
  fun_Update,
};
