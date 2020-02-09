exports.getFileExtName = (filename) => {
  let index = filename.lastIndexOf('.');
  return index > -1 ? filename.substr(index + 1) : null
};
