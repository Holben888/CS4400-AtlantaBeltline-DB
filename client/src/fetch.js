export default async (path, query) => {
  const params = Object.entries(query).reduce((queryString, param, index) => {
    const prefix = index === 0 ? '?' : '&'
    return `${queryString}${prefix}${param[0]}=${param[1]}`
  }, '')
  const request = await fetch(`http://localhost:3001${path}${params}`)
  if (!request.ok) {
    return { failed: request.status }
  } else {
    return await request.json()
  }
}
