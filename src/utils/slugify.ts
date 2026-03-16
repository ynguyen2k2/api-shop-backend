const slugify = (text: string, separator: string = '-') => {
  const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`(^${escapedSeparator}|${escapedSeparator}$)`, 'g'), '')
}

export default slugify
