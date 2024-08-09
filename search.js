import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs";

const options = {
  includeScore: true,
  shouldSort: true,
  keys: ["last_name", "first_name"],
};

function search(rooms, query) {
  const fuse = new Fuse(rooms, options);

  console.log(fuse.search(searchPattern));
  return fuse.search(searchPattern);
}
