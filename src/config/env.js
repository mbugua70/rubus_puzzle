const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('VITE_API_URL is missing. Add it to the frontend .env file.')
}

export const env = {
  apiUrl,
}
