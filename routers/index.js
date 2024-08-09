const Router = require("express");
let router = Router();

const { fun_Index } = require("../controllers/index.ctrl.js");

router.get("/", (request, response) => {
    return fun_Index(request, response);
});

module.exports = router;
