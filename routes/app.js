var express = require("express");
var router = express.Router();

// Require controller modules
var user_controller = require("../controllers/userscontroller");
var index_controller = require("../controllers/indexcontroller");
var matches_controller = require("../controllers/matchescontroller");

/**
 * Visitor Frontend
 */

router.get("/", index_controller.frontpage_get);

router.post("/login", index_controller.login_post);

router.get("/logout", index_controller.logout);

/**
 * Registered Frontend
 */

//User register form
router.get("/register", user_controller.user_create_get);

router.post("/register", user_controller.user_create_post);

// User CRUD
router.get("/user", user_controller.user_detail);

router.get("/user/update", user_controller.user_create_get);

router.post("/user/update", user_controller.user_create_post);

router.get("/user/:id/delete", user_controller.user_delete_get);

router.post("/user/:id/delete", user_controller.user_delete_post);

router.get("/user/:id/update", user_controller.user_update_get);

router.post("/user/:id/update", user_controller.user_update_post);

router.get("/user/:id", user_controller.user_detail);

router.get("/users", user_controller.user_list_possible_matches);

// Matches CRUD
router.get("/yourmatches/morematches", matches_controller.show_possible_match);

router.post("/yourmatches/:id/:name", matches_controller.make_dislike_match);

router.get("/yourmatches", matches_controller.see_all_matches);

module.exports = router;
