import { ref, computed } from 'vue'

// Stato globale per la ricerca dei veicoli
const globalSearchQuery = ref('')

export const useSearch = () => {
  const setSearchQuery = (query: string) => {
    globalSearchQuery.value = query
  }

  return {
    searchQuery: computed(() => globalSearchQuery.value),
    setSearchQuery
  }
}
