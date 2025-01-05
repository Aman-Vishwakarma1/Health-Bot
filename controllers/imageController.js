exports.uploadImage = async (req, res, next) => {
  const image = req.file;
  console.log(image);
  res.json({ message: "Done" });
};
