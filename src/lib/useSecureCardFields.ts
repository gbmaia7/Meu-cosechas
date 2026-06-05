import { useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    MercadoPago?: new (key: string, opts?: { locale: string }) => any;
  }
}

export type CardInfo = { paymentMethodId: string; issuerId?: string | number };

const FIELD_STYLE = {
  fontFamily: 'inherit',
  fontSize: '14px',
  fontWeight: '500',
  color: '#1c1b1b',
  placeholderColor: '#a8a29e',
  padding: '13px 16px',
};

const loadSdk = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.MercadoPago) { resolve(); return; }
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://sdk.mercadopago.com/js/v2"]');
    if (existing) { existing.addEventListener('load', () => resolve(), { once: true }); return; }
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Falha ao carregar MercadoPago.js'));
    document.body.appendChild(script);
  });

export function useSecureCardFields(
  publicKey: string,
  ids: { cardNumber: string; expiration: string; cvv: string },
  onCardInfo: (info: CardInfo) => void,
  enabled = true,
) {
  const mpRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || !publicKey) return;
    let active = true;

    loadSdk().then(() => {
      if (!active) return;
      try {
        const mp = new window.MercadoPago!(publicKey, { locale: 'pt-BR' });
        mpRef.current = mp;

        const numField = mp.fields.create('cardNumber', { placeholder: '0000 0000 0000 0000', style: FIELD_STYLE });
        const expField = mp.fields.create('expirationDate', { placeholder: 'MM/AA', style: FIELD_STYLE });
        const cvvField = mp.fields.create('securityCode', { placeholder: '123', style: FIELD_STYLE });

        numField.mount(ids.cardNumber);
        expField.mount(ids.expiration);
        cvvField.mount(ids.cvv);

        numField.on('binChange', async ({ bin }: { bin: string }) => {
          if (!bin || bin.length < 6) return;
          try {
            const methods = await mp.getPaymentMethods({ bin });
            const m = methods?.results?.[0] || methods?.[0];
            if (m) onCardInfo({ paymentMethodId: m.id, issuerId: m.issuer?.id });
          } catch { /* ignore */ }
        });

        mp._secureFields = { numField, expField, cvvField };
      } catch { /* ignore mount errors */ }
    }).catch(() => { /* ignore SDK load errors */ });

    return () => {
      active = false;
      const f = mpRef.current?._secureFields;
      try { f?.numField?.unmount(); f?.expField?.unmount(); f?.cvvField?.unmount(); } catch { /* ignore */ }
      mpRef.current = null;
    };
  }, [enabled, publicKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const createToken = useCallback(async (cardholderName: string, identificationNumber: string): Promise<string> => {
    if (!mpRef.current?.fields) throw new Error('Campos do cartão não carregados. Aguarde e tente novamente.');
    const result = await mpRef.current.fields.createCardToken({
      cardholderName,
      identificationType: 'CPF',
      identificationNumber: identificationNumber.replace(/\D/g, ''),
    });
    if (!result?.id) throw new Error('Não foi possível tokenizar o cartão. Verifique os dados e tente novamente.');
    return result.id as string;
  }, []);

  return { createToken };
}
