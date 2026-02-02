import { CartItem, PixPaymentResponse } from '../types';

// Agora apontamos para o nosso backend local, não diretamente para o MP
// Certifique-se de rodar 'node server.js' no terminal
const BACKEND_URL = 'http://localhost:3001/api/process_payment';

/**
 * Recupera o token de acesso. Prioridade:
 * 1. LocalStorage (Configurado via Painel Admin)
 * 2. Variável de Ambiente (Configurado no Build/Deploy)
 */
const getAccessToken = () => {
  return localStorage.getItem('mp_access_token') || process.env.REACT_APP_MP_ACCESS_TOKEN || '';
};

/**
 * Função de Fallback (Simulação)
 * Mantida para garantir que o app funcione mesmo sem o Backend rodando
 */
async function generateFallbackPix(total: number): Promise<PixPaymentResponse> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const pixCopyAndPaste = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Creamy Delivery6008Sao Paulo62070503***6304E2CA";
  
  // Tenta gerar imagem visualmente usando API pública
  let qrCodeBase64 = "";
  try {
    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCopyAndPaste)}`);
    const blob = await response.blob();
    const reader = new FileReader();
    qrCodeBase64 = await new Promise((resolve) => {
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Falha ao gerar QR visual simulado");
  }

  return {
    id: Math.floor(Math.random() * 1000000000),
    status: 'pending',
    point_of_interaction: {
      transaction_data: {
        qr_code: pixCopyAndPaste,
        qr_code_base64: qrCodeBase64,
        ticket_url: "https://mercadopago.com.br"
      }
    }
  };
}

export const createPixPayment = async (
  items: CartItem[], 
  total: number, 
  payerEmail: string = 'cliente@creamy.com.br'
): Promise<PixPaymentResponse | null> => {
  
  const token = getAccessToken();

  if (!token) {
    console.info("Modo Simulação: Token não configurado no Admin.");
    return generateFallbackPix(total);
  }

  // Validação de segurança básica do formato do token
  if (!token.startsWith('APP_USR-') && !token.startsWith('TEST-')) {
    console.warn("Token inválido. Use um Access Token (APP_USR- ou TEST-).");
    return generateFallbackPix(total);
  }

  try {
    const paymentData = {
      transaction_amount: Number(total.toFixed(2)),
      description: `Pedido Creamy - ${items.length} itens`,
      payment_method_id: "pix",
      payer: {
        email: payerEmail,
        first_name: "Cliente",
        last_name: "Creamy"
      },
      notification_url: "https://seusite.com/api/webhooks/mercadopago",
      idempotencyKey: crypto.randomUUID()
    };

    console.log("Enviando requisição para Backend Local...");

    // Chamada ao Backend Local (server.js)
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Passamos o token para o backend autenticar
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      // Se o backend responder com erro, ou se o backend estiver offline (catch)
      throw new Error(`Erro do Backend: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Verifica se o Mercado Pago retornou erro encapsulado
    if (data.error || data.status === 400 || data.status === 401) {
       console.error("Erro retornado pelo MP via Backend:", data);
       throw new Error("Erro de validação do Mercado Pago");
    }

    return {
      id: data.id,
      status: data.status,
      point_of_interaction: {
        transaction_data: {
          qr_code: data.point_of_interaction.transaction_data.qr_code,
          qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
          ticket_url: data.point_of_interaction.transaction_data.ticket_url
        }
      }
    };

  } catch (error) {
    console.error("FALHA NA INTEGRAÇÃO COM BACKEND:", error);
    console.warn("Verifique se você rodou 'node server.js' no terminal.");
    console.info("Usando Fallback (Simulação) para não travar o usuário.");
    
    return generateFallbackPix(total);
  }
};