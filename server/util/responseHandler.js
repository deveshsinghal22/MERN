let handler = {
  Response: (req, res) => {
    res.json(res.locals.responseObj)
  }
};

module.exports = handler;