import React, { useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import catalog from '../store-catalog.json';
import './store.css';
import StoreOffer from './StoreOffer';

export default function StoreCatalog() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All products');
  const groups = ['All products', ...new Set(catalog.products.map(p => p.group))];
  const visible = catalog.products.filter(p => (group === 'All products' || p.group === group) && `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <section className="home-wrap catalog-section">
    <StoreOffer />
    <div className="catalog-toolbar"><label className="catalog-search"><Search size={18}/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search weapons, blueprints, gear..." aria-label="Search products"/></label><label>Category<select value={group} onChange={e => setGroup(e.target.value)}>{groups.map(g => <option key={g}>{g}</option>)}</select></label></div>
    <div className="catalog-count" role="status">{visible.length} of {catalog.products.length} products & services</div>
    <div className="catalog-grid">{visible.map(p => <a className="catalog-product" key={p.id} href={`/go/catalog/${p.id}`} target="_blank" rel="sponsored noopener noreferrer"><div className="catalog-image">{p.image && <img src={p.image} alt={p.name} loading="lazy"/>}</div><div className="catalog-body"><span className="section-kicker">{p.group}</span><h2>{p.name}</h2><p>{p.description}</p><span className="tile-cta">View options & prices <ArrowUpRight size={16}/></span></div></a>)}</div>
    {!visible.length && <p>No matching products. <button className="catalog-reset" onClick={() => { setQuery(''); setGroup('All products'); }}>Clear filters</button></p>}
    <p className="affiliate-note">Checkout, fulfillment and order support are provided by ARC Store. Availability and final pricing are confirmed on the product page. We may earn a commission on purchases.</p>
  </section>;
}
