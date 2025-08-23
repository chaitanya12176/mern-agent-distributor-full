function distribute(items, agentIds) {
  const map = {};
  agentIds.forEach(a => (map[a] = []));
  let i = 0;
  for (const item of items) {
    const agentId = agentIds[i % agentIds.length];
    map[agentId].push(item);
    i++;
  }
  return map;
}
module.exports = { distribute };
