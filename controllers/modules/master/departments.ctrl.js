const sequelize = require("../../../configuration/db/dbpool.conf.js");

const { ApiResponse, FLAG, STATUS_CODES, STATUS_MESSAGE } = require("../../../configuration/utils/ApiResponse.conf.js");

const { PAGINATION_INPUT } = require("../../../configuration/utils/Constant.conf.js");

const Department = require("../../../models/departments.model.js");

const fun_SelectById = async (req, res) => {
  try {
    const department_id = req.body.department_id || 0;
    const result = await Department.findOne({ where: { department_id: department_id } });
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
    const Users = await Department.findAndCountAll({
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
    const department_id = req.body.department_id || 0;
    const result = await Department.destroy({ where: { department_id: department_id } });
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
    const { title, is_active, created_by } = req.body;
    const result = await Department.create({ title, is_active, created_by });
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
    const { department_id, title, is_active, created_by } = req.body;
    const [result] = await Department.update(
      { title, is_active, created_by },
      {
        where: { department_id },
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

const fun_RowSelectById = async (req, res) => {
  try {
    const department_id = req.body.department_id || 1;

    const [results] = await sequelize.query(`SELECT * FROM tbldepartments WHERE department_id = :department_id`, {
      replacements: { department_id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length == 0) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    } else {
      return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.SUCCESS, results));
    }
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_PerformTransactionInsert = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { title, is_active, created_by } = req.body;
    const result = await Department.create({ title, is_active, created_by }, { transaction: t });
    await t.commit();
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.INSERT, result));
  } catch (err) {
    await t.rollback();
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_PerformTransactionUpdate = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { department_id, title, is_active, created_by } = req.body;
    const [result] = await Department.update(
      { title, is_active, created_by },
      {
        where: { department_id },
        transaction: t,
      }
    );
    if (!result) {
      await t.rollback();
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }
    await t.commit();
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.UPDATE, result));
  } catch (err) {
    await t.rollback();
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
  fun_RowSelectById,
  fun_PerformTransactionInsert,
  fun_PerformTransactionUpdate,
};
