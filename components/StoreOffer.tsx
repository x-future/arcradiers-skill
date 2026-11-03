import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function StoreOffer() {
  const [status, setStatus] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText('ARCSKILLER');
      setStatus('Copied');
    } catch {
      setStatus('Copy manually: ARCSKILLER');
    }
  };
  return <aside className="promo" aria-label="ARC Store offer">
    <div><strong>ARCSKILLER</strong><p>10% off eligible catalog items.</p></div>
    <button type="button" onClick={copy}>{status === 'Copied' ? <Check size={16}/> : <Copy size={16}/>}Copy code</button>
    <p>Level V weapon builds, Raider Loadouts and blueprint sets retain their own pricing and do not receive this extra discount. Confirm eligibility and the final price at checkout.</p>
    <span role="status">{status}</span>
  </aside>;
}
