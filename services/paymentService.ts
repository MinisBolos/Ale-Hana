import { PixConfig } from '../types';

export const getPixConfig = (): PixConfig => {
  return {
    key: localStorage.getItem('creamy_pix_key') || '',
    bank: localStorage.getItem('creamy_pix_bank') || '',
    owner: localStorage.getItem('creamy_pix_owner') || ''
  };
};

// --- Funções Auxiliares para Geração do Payload Pix (EMV QRCPS MPM) ---

/**
 * Calcula o CRC16-CCITT (0xFFFF) necessário para o padrão Pix
 */
function getCRC16(payload: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }
  
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Formata um campo TLV (Type-Length-Value)
 */
function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Remove acentos e caracteres especiais para compatibilidade
 */
function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

/**
 * Gera a string completa do Payload Pix
 */
export const generatePixPayload = (
  key: string, 
  name: string, 
  city: string = 'SAO PAULO', 
  amount?: number, 
  txid: string = '***'
): string => {
  const cleanKey = key.trim();
  const cleanName = normalizeText(name).substring(0, 25) || 'MERCHANT';
  const cleanCity = normalizeText(city).substring(0, 15) || 'SAO PAULO';
  const cleanTxId = txid || '***';

  // 00 - Payload Format Indicator
  // 26 - Merchant Account Information (GUI + Chave)
  // 52 - Merchant Category Code
  // 53 - Transaction Currency
  // 54 - Transaction Amount (Opcional)
  // 58 - Country Code
  // 59 - Merchant Name
  // 60 - Merchant City
  // 62 - Additional Data Field Template (TxID)
  // 63 - CRC16

  const merchantAccountInfo = formatField('00', 'br.gov.bcb.pix') + formatField('01', cleanKey);
  
  let payload = 
    formatField('00', '01') + // Format Indicator
    formatField('26', merchantAccountInfo) + 
    formatField('52', '0000') + // MCC
    formatField('53', '986');   // Currency (BRL)

  if (amount && amount > 0) {
    payload += formatField('54', amount.toFixed(2));
  }

  payload += 
    formatField('58', 'BR') +
    formatField('59', cleanName) +
    formatField('60', cleanCity) +
    formatField('62', formatField('05', cleanTxId));

  payload += '6304'; // Adiciona ID do CRC e tamanho (04)

  const crc = getCRC16(payload);
  return payload + crc;
};

/**
 * Gera a URL do QR Code usando o Payload Pix correto em vez de apenas a chave.
 * Aceita parâmetros opcionais para gerar QR Codes com valor definido.
 */
export const getPixQrCodeUrl = (key: string, name: string = '', amount?: number): string => {
  if (!key) return '';
  
  // Se não tiver nome configurado, usa um genérico
  const merchantName = name || 'PudiMousse';
  
  // Gera o código BRCode oficial
  const payload = generatePixPayload(key, merchantName, 'SAO PAULO', amount);
  
  // Retorna URL da API de QR Code com o payload codificado
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
};