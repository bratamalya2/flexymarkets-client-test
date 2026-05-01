export function parseReferralTree(data) {
  const result = [];

  for (const key in data) {
    const child = data[key];

    const node = {
      title: key,
      hasChildren: child && typeof child === 'object',
      children: child && typeof child === 'object' ? parseReferralTree(child) : []
    };

    result.push(node);
  }

  return result;
}