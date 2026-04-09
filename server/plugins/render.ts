export default defineNitroPlugin((nitroApp) => {
  // Configurazione per Render: ascoltare su 0.0.0.0 e usare la porta da process.env.PORT
  if (process.env.NODE_ENV === 'production') {
    process.env.HOST = '0.0.0.0'
    process.env.PORT = process.env.PORT || '10000'
  }

  // Hook per il server Node.js nativo (per impostare i timeout richiesti da Render)
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    // Nota: Nitro gestisce internamente il server, ma per Express/Node server specifici:
    const nodeRes = event.node?.res
    if (nodeRes && nodeRes.socket && nodeRes.socket.server) {
      const server = nodeRes.socket.server
      if (!server._renderTimeoutsSet) {
        server.keepAliveTimeout = 120000
        server.headersTimeout = 121000
        server._renderTimeoutsSet = true
        console.log('✅ Server timeouts configured for Render')
      }
    }
  })
})
