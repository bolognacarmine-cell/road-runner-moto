import { ref } from 'vue'

const activeFilter = ref('tutti')

export const useFilter = () => {
  const setFilter = (filter: string) => {
    activeFilter.value = filter
  }

  return {
    activeFilter,
    setFilter
  }
}
