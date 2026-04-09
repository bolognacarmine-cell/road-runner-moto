export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:chunkError', ({ error }) => {
    console.error('Chunk loading error detected:', error)
    
    // In produzione, ricarichiamo la pagina per forzare il caricamento dei nuovi chunk
    if (process.env.NODE_ENV === 'production') {
      window.location.reload()
    }
  })
})
