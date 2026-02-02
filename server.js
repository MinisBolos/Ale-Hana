const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3001; // Rodando em porta diferente do React (3000)

// Configuração de CORS para aceitar requisições do Frontend
app.use(cors());
app.use(express.json());

const MP_API_URL = 'https://api.mercadopago.com/v1/payments';

app.post('/api/process_payment', async (req, res) => {
  try {
    // 1. Recebe o Token enviado pelo Frontend (via Configurações do Admin)
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token de acesso não fornecido.' });
    }

    const paymentData = req.body;

    console.log(`Processing payment... Amount: ${paymentData.transaction_amount}`);

    // 2. Faz a chamada Server-to-Server para o Mercado Pago
    // Servidores não sofrem bloqueio de CORS
    const mpResponse = await fetch(MP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': authHeader, // Repassa o token
        'Content-Type': 'application/json',
        'X-Idempotency-Key': paymentData.idempotencyKey || Date.now().toString()
      },
      body: JSON.stringify({
        transaction_amount: paymentData.transaction_amount,
        description: paymentData.description,
        payment_method_id: paymentData.payment_method_id,
        payer: paymentData.payer,
        notification_url: paymentData.notification_url
      })
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Mercado Pago Error:', data);
      return res.status(mpResponse.status).json(data);
    }

    // 3. Devolve a resposta limpa para o Frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Falha interna no servidor de pagamentos.' });
  }
});

app.listen(PORT, () => {
  console.log(`
  🚀 Backend de Pagamentos rodando em: http://localhost:${PORT}
  ✅ Endpoint pronto: POST /api/process_payment
  `);
});