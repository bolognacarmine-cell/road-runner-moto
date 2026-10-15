import { useState } from '#app'

export const useSearch = () => {
  const searchQuery = useState('globalSearchQuery', () => '')

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  return {
    searchQuery,
    setSearchQuery
  }
}
