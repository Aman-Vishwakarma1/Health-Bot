exports.uploadImage = async (req, res, next) => {
  const image = req.file;
  if (!image) {
    return res
      .status(422)
      .json({ message: "Invalid Image Input Upload png, jpeg, jpg Only." });
  }
  req.session.imageUrl = image.path;
};
