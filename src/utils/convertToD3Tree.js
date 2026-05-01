export const convertToD3Tree = (node) => {
  // const match = (node?.title)?.match(/-(\w+)-/);
  const match = (node?.title).split("-")
  return {
    referral: match[1],
    name: match[0] || "",
    totalTeam: match[2],
    children: node.children?.map(convertToD3Tree) || []
  }
}