import Fuse from "fuse.js";

const options = {
  includeScore: true,
  threshold: 0.2,
  keys: ["college", "building", "room", "type", "sqft"],
};

export function search(rooms, query) {
  const fuse = new Fuse(rooms, options);
  const results = fuse.search(query);
  console.log(results);
  return results.map((item) => item.item);
}
