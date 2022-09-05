function compareFunctions(a,b) {
    const nameA = a.wordInput.toUpperCase();
    const nameB = b.wordInput.toUpperCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }
    return 0;
}

module.exports = {
  compareFunctions,
};
