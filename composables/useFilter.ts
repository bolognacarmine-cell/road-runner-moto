import { useState } from '#app'

export const useFilter = () => {
  const activeFilter = useState('globalActiveFilter', () => 'tutti')

  const setFilter = (filter: string) => {
    activeFilter.value = filter
  }

  return {
    activeFilter,
    setFilter
  }
}
