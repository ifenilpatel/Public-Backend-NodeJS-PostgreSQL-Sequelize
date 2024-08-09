const express = require("express");
let router = express.Router();

const { fun_SelectById, fun_SelectAll, fun_DeleteById, fun_Insert, fun_Update, fun_RowSelectById } = require("../controllers/departments.ctrl.js");

router.post("/selectbyid", (request, response) => {
  return fun_SelectById(request, response);
});

router.post("/selectall", (request, response) => {
  return fun_SelectAll(request, response);
});

router.post("/deletebyid", (request, response) => {
  return fun_DeleteById(request, response);
});

router.post("/insert", (request, response) => {
  return fun_Insert(request, response);
});

router.post("/update", (request, response) => {
  return fun_Update(request, response);
});

router.get("/rawselectbyid", (request, response) => {
  return fun_RowSelectById(request, response);
});

module.exports = router;
