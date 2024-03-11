module.exports = function (req, res, next) {
  if (req.user.role !== "moderator")
    return res.status(403).send("Access denied. Only moderators can access.");
  next();
};
