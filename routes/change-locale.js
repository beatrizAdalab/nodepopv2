const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {
  // collect the chosen locale
  const locale = req.params.locale;

  // save the previous page to return
  const backTo = req.get('referer');

  //we set a new language cookie
  res.cookie('nodepopv2-locale', locale, { maxAge: 1000 * 60 * 60 * 24 * 20 }); // maxAge in ms

  // we redirect to the source page
  res.redirect(backTo);
});

module.exports = router;


