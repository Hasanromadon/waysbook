if (queryImage) {
  if (fs.existsSync(path.join(__dirname, 'uploads/projects', currentFile))) {
    fs.unlinkSync(path.join(__dirname, 'uploads/projects', currentFile));
  }
}
