const { ApiResponse, FLAG, STATUS_CODES, STATUS_MESSAGE } = require("../../../configuration/utils/ApiResponse.conf.js");

const { PAGINATION_INPUT } = require("../../../configuration/utils/Constant.conf.js");

const Designation = require("../../../models/designations.model.js");

const fun_SelectById = async (req, res) => {
  try {
    const designation_id = req.body.designation_id || 0;
    const result = await Designation.findOne({ where: { designation_id: designation_id } });
    if (!result) {
      // 404
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    } else {
      // 200
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
    const Users = await Designation.findAndCountAll({
      limit: pageSize,
      offset: offset,
    });

    if (Users.count == 0) {
      // 404
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    } else {
      // 200
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
    const designation_id = req.body.designation_id || 0;
    const result = await Designation.destroy({ where: { designation_id: designation_id } });
    if (!result) {
      // 404
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }
    // 200
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
    const { title, is_active, created_by } = req.body;
    const result = await Designation.create({ title, is_active, created_by });
    // 200
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
    const { designation_id, title, is_active, created_by } = req.body;
    const [result] = await Designation.update(
      { title, is_active, created_by },
      {
        where: { designation_id },
      }
    );
    if (!result) {
      // 404
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }
    // 200
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
