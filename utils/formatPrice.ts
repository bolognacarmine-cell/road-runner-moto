export const formatPrice = (price: number | null | undefined, zeroLabel: string = 'Prezzo riservato') => {
  if (price === 0) {
    return zeroLabel
  }
  
  if (price === null || price === undefined || price === '') {
    return 'Prezzo su richiesta'
  }
  
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(Number(price))
}
