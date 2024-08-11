const { sequelize, Op } = require("../../../configuration/db/dbpool.conf.js");

const { ApiResponse, FLAG, STATUS_CODES, STATUS_MESSAGE } = require("../../../configuration/utils/ApiResponse.conf.js");
const { currentDate, randomNumber } = require("../../../configuration/utils/Common.conf.js");
const { generateToken } = require("../../../configuration/utils/Security.conf.js");

const { send_Email } = require("../../../configuration/utils/Email.conf.js");

const User = require("../../../models/users.model.js");

const fun_Register_User = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { first_name = "", last_name = "", email_id = "", mobile = "", password = "", user_type = "User", is_active = true } = req.body;
    // use array some.
    if (first_name == "" || last_name == "" || email_id == "" || mobile == "" || password == "") {
      let pera = [
        {
          first_name,
          last_name,
          email_id,
          mobile,
          password,
        },
      ];
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NEED_PARAM, STATUS_MESSAGE.NEED_PARAM, pera));
    }

    const existingUser = await User.findAll({
      where: {
        [Op.or]: [{ email_id }, { mobile }],
      },
    });

    if (existingUser.length != 0) {
      if (existingUser[0].email_id == email_id) {
        return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.EXIST_DATA, "Email is already exist.", []));
      }
      if (existingUser[0].mobile == mobile) {
        return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.EXIST_DATA, "Mobile is already exist.", []));
      }
    }

    const opt_number = randomNumber(4);

    const is_email_verified = false;
    const is_mobile_verified = false;
    const email_otp = opt_number;
    const mobile_otp = 0;

    const result = await User.create(
      {
        first_name,
        last_name,
        email_id,
        mobile,
        password,
        user_type,
        is_email_verified,
        email_otp,
        is_mobile_verified,
        mobile_otp,
        is_active,
      },
      {
        transaction: t,
      }
    );

    //# Send Email to email_id
    const email_status = await send_Email(email_id, "Verification: OTP", opt_number);
    if (!email_status) {
      await t.rollback();
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.VERIFICATION_ERROR, "Failed to send OTP, Please try again after sometime.", []));
    }

    // Generate token
    let token = {
      user_id: result.user_id,
      user_type: result.user_type,
      token_created_at: currentDate(),
      time: 10,
    };

    let encrypt_token = generateToken(token);

    let user_data = [
      {
        first_name: result.first_name,
        last_name: result.last_name,
        email_id: result.email_id,
        token: encrypt_token,
      },
    ];

    await t.commit();
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, STATUS_MESSAGE.INSERT, user_data));
  } catch (err) {
    await t.rollback();
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_Signin = async (req, res) => {
  try {
    const { email_id = "", password = "" } = req.body;
    if (email_id == "" || password == "") {
      let pera = [
        {
          email_id: email_id,
          password: password,
        },
      ];
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NEED_PARAM, STATUS_MESSAGE.NEED_PARAM, pera));
    }

    const result = await User.findOne({ where: { email_id: email_id } });
    if (!result) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }

    if (result.password != password) {
      return res.json(
        new ApiResponse(FLAG.FAIL, STATUS_CODES.UNAUTHORIZED, "The provided credentials are incorrect. Please check your email and password and try again.", [])
      );
    }

    if (result.is_email_verified == false) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.VERIFICATION_FLAG_EMAIL, STATUS_MESSAGE.VERIFICATION_FLAG_EMAIL, []));
    }

    // Generate token
    let token = {
      user_id: result.user_id,
      user_type: result.user_type,
      token_created_at: currentDate(),
      time: 24 * 60,
    };

    let encrypt_token = generateToken(token);

    let user_data = [
      {
        first_name: result.first_name,
        last_name: result.last_name,
        email_id: result.email_id,
        token: encrypt_token,
      },
    ];

    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, "login successfully", user_data));
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_Send_Email_OTP = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email_id = "" } = req.body;
    if (email_id == "") {
      let pera = [
        {
          email_id: email_id,
        },
      ];
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NEED_PARAM, STATUS_MESSAGE.NEED_PARAM, pera));
    }

    const result = await User.findOne({ where: { email_id: email_id } });
    if (!result) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }

    const opt_number = randomNumber(4);

    const user_id = result.user_id;
    await User.update({ email_otp: opt_number, is_email_verified: false }, { where: { user_id }, transaction: t });
    //# Send Email to email_id
    const email_status = await send_Email(email_id, "Verification: OTP", opt_number);
    if (!email_status) {
      await t.rollback();
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.VERIFICATION_ERROR, "Failed to send OTP, Please try again after sometime.", []));
    }
    await t.commit();
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, "Email sent succussfully.", []));
  } catch (err) {
    await t.rollback();
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_Verify_Email = async (req, res) => {
  try {
    const user_id = req.body.auth_user_id;
    const OTP = req.body.OTP;

    const user = await User.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }

    if (user.email_otp != OTP) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.VERIFICATION_ERROR, "OTP not matched.", []));
    }

    await User.update({ is_email_verified: true }, { where: { user_id } });
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, "Your email has been successfully verified! You can now log in.", []));
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_Forgot_Password = async (req, res) => {
  try {
    const { email_id = "", origin_URL = "" } = req.body;
    if (email_id == "" || origin_URL == "") {
      let pera = [
        {
          email_id: email_id,
          origin_URL: origin_URL,
        },
      ];
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NEED_PARAM, STATUS_MESSAGE.NEED_PARAM, pera));
    }

    const result = await User.findOne({ where: { email_id: email_id } });
    if (!result) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }

    if (result.is_email_verified == false) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.VERIFICATION_FLAG_EMAIL, STATUS_MESSAGE.VERIFICATION_FLAG_EMAIL, user_data));
    }

    // Generate token
    let token = {
      user_id: result.user_id,
      token_created_at: currentDate(),
      time: 5,
    };

    let encrypt_token = generateToken(token);

    //# Send Email to email_id
    const email_status = await send_Email(email_id, "Verification: OTP", `${origin_URL}?token=${encrypt_token}`);
    if (!email_status) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.VERIFICATION_ERROR, "Failed to send OTP, Please try again after sometime.", []));
    }
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, "Email sent succussfully.", []));
  } catch (err) {
    await t.rollback();
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

const fun_Change_Password = async (req, res) => {
  try {
    const user_id = req.body.auth_user_id;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    if (password != confirm_password) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.VERIFICATION_ERROR, "Password not matched.", []));
    }

    const user = await User.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.NO_DATA, STATUS_MESSAGE.NO_DATA, []));
    }

    await User.update({ password: password }, { where: { user_id } });
    return res.json(new ApiResponse(FLAG.SUCCESS, STATUS_CODES.SUCCESS, "Password updated succussfully.", []));
  } catch (err) {
    if (process.env.CODE_LOGS == "true") {
      console.error(`Error: `, err);
    }
    return res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, STATUS_MESSAGE.SYSTEM_ERROR, { originalUrl: req.originalUrl }));
  }
};

module.exports = {
  fun_Register_User,
  fun_Signin,
  fun_Send_Email_OTP,
  fun_Verify_Email,
  fun_Forgot_Password,
  fun_Change_Password,
};
