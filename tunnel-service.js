const localtunnel = require('localtunnel');

async function startTunnel() {
  console.log('Avvio tunnel per porta 3000...');
  try {
    const tunnel = await localtunnel({
      port: 3000,
      subdomain: 'magazzino-resta-bari'
    });
    console.log('>>> TUNNEL ATTIVO SU:', tunnel.url);
    console.log('>>> URL DIRETTO MAGAZZINO:', tunnel.url + '/magazzino');

    tunnel.on('close', () => {
      console.log('Tunnel chiuso. Riconnessione automatica...');
      setTimeout(startTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('Errore tunnel:', err);
      setTimeout(startTunnel, 3000);
    });
  } catch (err) {
    console.error('Errore avvio tunnel:', err);
    setTimeout(startTunnel, 4000);
  }
}

startTunnel();
