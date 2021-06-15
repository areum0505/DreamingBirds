// module.exports = function (app) {
//     app.get('/', function (req, res) {
//         res.render('index.html');
//     });
//     app.get('/select', function (req, res) {
//         res.render('selectSubjectPage.html');
//     });
//     app.get('/home', function (req, res) {
//         res.render('homePage.html');
//     });
//     app.get('/my', function (req, res) {
//         res.render('mypage.html');
//     });
//     app.get('/study', function (req, res) {
//         res.render('studyPage.html');
//     });
// }

var express = require('express');
const { session } = require('passport');
var router = express.Router();

router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    console.log("세션이 유효합니다.");
  } else {
    console.log("세션이 유효하지 않습니다.");
  }
  res.render('index', { user: req.user });
});

router.get('/study', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('studyPage', { user: req.user });
  } else {
    res.render('main', { user: req.user });
  }
});
router.get('/home', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('homePage', { user: req.user });
  } else {
    res.render('main', { user: req.user });
  }
});
router.get('/my', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('mypage', { user: req.user });
  } else {
    res.render('main', { user: req.user });
  }
});
router.get('/googlelogin', function (req, res) {
  res.render('main', { user: req.user });
});

module.exports = router;