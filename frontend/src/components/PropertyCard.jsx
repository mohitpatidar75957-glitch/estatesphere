import { ArrowUpRight, BedDouble, Maximize2 } from 'lucide-react'

export default function PropertyCard({ property, selected, onSelect }) {
  return <article className={`property-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(property)}>
    <div className={`property-visual ${property.tone}`}><span>{property.tag}</span><div className="mini-building"><i/><i/><i/></div></div>
    <div className="property-copy"><div><small>{property.city} · {property.address}</small><h3>{property.title}</h3></div><ArrowUpRight size={20}/></div>
    <div className="property-meta"><span><BedDouble size={15}/>{property.bedrooms} beds</span><span><Maximize2 size={15}/>{property.areaSqft.toLocaleString()} sq.ft.</span><strong>₹{(property.price/10000000).toFixed(1)} Cr</strong></div>
  </article>
}
