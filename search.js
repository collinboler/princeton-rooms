function divide() {}

function search(rooms, query) {
  const options = {
    includeScore: true,
    shouldSort: true,
    keys: ["last_name", "first_name"],
  };

  const fuse = new Fuse(rooms, options);

  console.log(fuse.search(searchPattern));
  return fuse.search(searchPattern);
}
