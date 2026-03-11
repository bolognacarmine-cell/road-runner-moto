import { ref, computed } from 'vue'

export const useVehicles = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:3001'

  const vehicles = ref([])
  const pending = ref(false)
  const error = ref(null)

  // Funzione per caricare i veicoli dal backend
  const fetchVehicles = async () => {
    pending.value = true
    error.value = null

    try {
      const { data } = await useFetch(`${apiBase}/veicoli`, {
        server: true
      })

      if (Array.isArray(data.value)) {
        vehicles.value = data.value
      } else {
        vehicles.value = []
      }
    } catch (err) {
      error.value = err
    } finally {
      pending.value = false
    }
  }

  // Filtri reattivi
  const filters = ref({
    condition: 'all', // all | nuove | usate
    search: '',
    sort: 'price-asc' // price-asc | price-desc | year-desc
  })

  // Veicoli filtrati
  const filteredVehicles = computed(() => {
    return vehicles.value.filter((v) => {
      const query = filters.value.search.toLowerCase().trim()
      const condition = (v.condizione || v.stato || '').toString().toLowerCase()

      const matchCondition =
        filters.value.condition === 'all' ||
        (filters.value.condition === 'nuove' && condition.includes('nuov')) ||
        (filters.value.condition === 'usate' && condition.includes('usat'))

      const matchSearch =
        !query || `${v.marca || ''} ${v.modello || ''}`.toLowerCase().includes(query)

      return matchCondition && matchSearch
    })
  })

  // Veicoli in evidenza (top 6)
  const featuredVehicles = computed(() => {
    const items = [...filteredVehicles.value]

    switch (filters.value.sort) {
      case 'price-desc':
        items.sort((a, b) => (b.prezzo || 0) - (a.prezzo || 0))
        break
      case 'year-desc':
        items.sort((a, b) => (b.annoImmatricolazione || b.anno || 0) - (a.annoImmatricolazione || a.anno || 0))
        break
      default:
        items.sort((a, b) => (a.prezzo || 0) - (b.prezzo || 0))
    }

    return items.slice(0, 6)
  })

  // Avvia il fetch automaticamente se usato nel setup()
  fetchVehicles()

  return {
    vehicles,
    pending,
    error,
    filters,
    filteredVehicles,
    featuredVehicles,
    fetchVehicles
  }
}