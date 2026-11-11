// Utility to generate and print / save high-resolution Architectural Brochure PDF for apartments

export function openApartmentBrochure(apartment) {
  if (!apartment) return

  const apt = {
    apartmentNumber: apartment.apartmentNumber || 'No-01',
    typology: apartment.typology || 'Luxury Residence',
    bedrooms: Number(apartment.bedrooms) || 3,
    bathrooms: Number(apartment.bathrooms) || 3,
    areaSqm: apartment.areaSqm || 240,
    areaSqft: apartment.areaSqft || Math.round((apartment.areaSqm || 240) * 10.7639),
    terraceArea: apartment.terraceArea || 50,
    block: apartment.block || 'BLOCK B1',
    floor: apartment.floor || 'Level 4',
    completion: apartment.completion || '4Q 2026',
    price: apartment.price || '₹ 2.85 Cr',
    status: apartment.status || 'AVAILABLE',
    description: apartment.description || 'A bespoke architectural residence featuring floor-to-ceiling acoustic glazing, expansive entertaining salon, private solarium terrace, and custom Italian craftsmanship.'
  }

  // SVG Floor plan markup based on bedroom count
  let floorPlanSvg = ''
  if (apt.bedrooms === 4) {
    floorPlanSvg = `
      <svg viewBox="0 0 280 140" width="100%" height="220" style="background:#f8f6f0;border-radius:6px;border:1px solid #e2ded5;">
        <rect x="8" y="10" width="46" height="120" fill="#eadcce" />
        <line x1="18" y1="10" x2="18" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <line x1="28" y1="10" x2="28" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <line x1="38" y1="10" x2="38" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <rect x="12" y="80" width="38" height="42" rx="3" fill="#e1e5de" />
        <circle cx="31" cy="101" r="9" fill="#cbdde5" />
        <rect x="54" y="10" width="218" height="120" fill="#f4efe5" stroke="#252822" stroke-width="1.8" />
        <line x1="124" y1="10" x2="124" y2="130" stroke="#252822" stroke-width="1" />
        <line x1="196" y1="10" x2="196" y2="130" stroke="#252822" stroke-width="1" />
        <line x1="124" y1="68" x2="272" y2="68" stroke="#252822" stroke-width="1" />
        <line x1="196" y1="42" x2="272" y2="42" stroke="#252822" stroke-width="1" />
        <line x1="196" y1="96" x2="272" y2="96" stroke="#252822" stroke-width="1" />
        <text x="64" y="66" font-size="5" fill="#475569" font-family="sans-serif" font-weight="700">GRAND LIVING SALON</text>
        <text x="138" y="58" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">FORMAL DINING</text>
        <text x="140" y="99" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">CHEF KITCHEN</text>
        <text x="202" y="39" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">MASTER SUITE 01</text>
        <text x="202" y="63" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">BEDROOM 02</text>
        <text x="202" y="90" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">BEDROOM 03</text>
        <text x="202" y="125" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">BEDROOM 04</text>
      </svg>
    `
  } else if (apt.bedrooms === 2) {
    floorPlanSvg = `
      <svg viewBox="0 0 280 140" width="100%" height="220" style="background:#f8f6f0;border-radius:6px;border:1px solid #e2ded5;">
        <rect x="10" y="10" width="60" height="120" fill="#eadcce" />
        <line x1="20" y1="10" x2="20" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <line x1="30" y1="10" x2="30" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <line x1="40" y1="10" x2="40" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <line x1="50" y1="10" x2="50" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <rect x="10" y="80" width="40" height="40" fill="#e1e5de" />
        <rect x="70" y="10" width="200" height="120" fill="#f4efe5" stroke="#252822" stroke-width="1.8" />
        <line x1="160" y1="10" x2="160" y2="130" stroke="#252822" stroke-width="1" />
        <line x1="210" y1="10" x2="210" y2="70" stroke="#252822" stroke-width="1" />
        <line x1="160" y1="70" x2="270" y2="70" stroke="#252822" stroke-width="1" />
        <text x="92" y="70" font-size="5" fill="#475569" font-family="sans-serif" font-weight="700">LIVING SALON</text>
        <text x="168" y="46" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">KITCHEN</text>
        <text x="222" y="55" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">MASTER BED</text>
        <text x="172" y="115" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">BEDROOM 02</text>
      </svg>
    `
  } else {
    // 3 Bedrooms (Default for No-25 etc.)
    floorPlanSvg = `
      <svg viewBox="0 0 280 140" width="100%" height="220" style="background:#f8f6f0;border-radius:6px;border:1px solid #e2ded5;">
        <rect x="10" y="10" width="55" height="120" fill="#eadcce" />
        <line x1="20" y1="10" x2="20" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <line x1="30" y1="10" x2="30" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <line x1="40" y1="10" x2="40" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <line x1="50" y1="10" x2="50" y2="130" stroke="#d5c8bb" stroke-width="0.8" />
        <rect x="12" y="75" width="38" height="45" rx="3" fill="#e1e5de" />
        <circle cx="31" cy="97" r="10" fill="#cbdde5" />
        <rect x="65" y="10" width="205" height="120" fill="#f4efe5" stroke="#252822" stroke-width="1.8" />
        <line x1="145" y1="10" x2="145" y2="130" stroke="#252822" stroke-width="1" />
        <line x1="205" y1="10" x2="205" y2="130" stroke="#252822" stroke-width="1" />
        <line x1="145" y1="65" x2="270" y2="65" stroke="#252822" stroke-width="1" />
        <text x="82" y="65" font-size="5" fill="#475569" font-family="sans-serif" font-weight="700">LIVING SALON</text>
        <text x="156" y="48" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">BEDROOM 03</text>
        <text x="152" y="105" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">KITCHEN & DINING</text>
        <text x="214" y="48" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">MASTER SUITE 01</text>
        <text x="218" y="105" font-size="4.5" fill="#64748b" font-family="sans-serif" font-weight="700">BEDROOM 02</text>
      </svg>
    `
  }

  const printWindow = window.open('', '_blank')

  if (!printWindow) {
    // If popup is blocked by browser, directly download or open the master PDF
    window.location.href = '/assets/Dwellora_Master_Brochure.pdf'
    return
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Architectural Factsheet & Brochure — Residence ${apt.apartmentNumber} | EstateSphere Dwellora</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #f7f5f0;
      color: #1e293b;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    
    /* Top Action Bar (Visible in browser, hidden when printing) */
    .action-bar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 9999;
    }
    .action-bar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 0.12em;
      color: #e2c285;
    }
    .action-bar-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn-action {
      background: #c5a880;
      color: #0f172a;
      border: none;
      padding: 8px 18px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-action:hover {
      background: #dfc299;
      transform: translateY(-1px);
    }
    .btn-action-outline {
      background: transparent;
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-action-outline:hover {
      background: rgba(255,255,255,0.1);
      border-color: #ffffff;
    }

    /* Brochure Sheet Container */
    .sheet-wrapper {
      max-width: 960px;
      margin: 30px auto 60px auto;
      background: #ffffff;
      border: 1px solid #e5e2da;
      box-shadow: 0 10px 40px rgba(0,0,0,0.06);
      padding: 50px 60px;
      border-radius: 2px;
    }

    /* Header */
    .brochure-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 24px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      letter-spacing: 0.15em;
      font-weight: 800;
      color: #0f172a;
    }
    .brand-subtitle {
      font-size: 11px;
      letter-spacing: 0.2em;
      color: #b89758;
      font-weight: 700;
      margin-top: 4px;
    }
    .header-meta {
      text-align: right;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .header-meta b {
      color: #0f172a;
    }

    /* Unit Title Hero */
    .unit-hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }
    .unit-number {
      font-family: 'Playfair Display', serif;
      font-size: 44px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.1;
    }
    .unit-typology {
      font-size: 14px;
      letter-spacing: 0.12em;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .unit-status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 30px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      background: #eef8f2;
      color: #15803d;
      border: 1px solid #bbf7d0;
      text-transform: uppercase;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      background: #faf8f5;
      padding: 20px;
      border-radius: 4px;
      border: 1px solid #eee8df;
      margin-bottom: 30px;
    }
    .metric-card {
      text-align: center;
      border-right: 1px solid #e5ded3;
      padding: 0 10px;
    }
    .metric-card:last-child {
      border-right: none;
    }
    .metric-label {
      font-size: 10px;
      letter-spacing: 0.15em;
      font-weight: 700;
      color: #78716c;
      text-transform: uppercase;
    }
    .metric-val {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 4px;
    }
    .metric-sub {
      font-size: 11px;
      color: #94a3b8;
    }

    /* Section Headings */
    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 0.15em;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 16px;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title span {
      font-size: 11px;
      color: #b89758;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
    }

    /* Floor Plan Box */
    .floorplan-section {
      margin-bottom: 32px;
    }

    /* Specifications Table */
    .specs-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 12.5px;
    }
    .specs-table th {
      text-align: left;
      background: #0f172a;
      color: #e2c285;
      padding: 10px 14px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .specs-table td {
      padding: 11px 14px;
      border-bottom: 1px solid #eef2f6;
      color: #334155;
    }
    .specs-table tr:nth-child(even) td {
      background: #fafaf9;
    }
    .specs-table td b {
      color: #0f172a;
    }

    /* Highlights 2-Col */
    .highlights-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    .highlight-box {
      background: #faf8f5;
      padding: 18px 20px;
      border-radius: 4px;
      border-left: 3px solid #b89758;
    }
    .highlight-box h4 {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
      letter-spacing: 0.05em;
    }
    .highlight-box ul {
      list-style-type: disc;
      padding-left: 18px;
      font-size: 12px;
      color: #475569;
      line-height: 1.6;
    }

    /* Footer */
    .brochure-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      color: #64748b;
    }
    .footer-left b {
      color: #0f172a;
    }

    /* Print Styles */
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .action-bar {
        display: none !important;
      }
      .sheet-wrapper {
        margin: 0 !important;
        padding: 20px 25px !important;
        border: none !important;
        box-shadow: none !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Action Bar -->
  <header class="action-bar">
    <div class="action-bar-brand">
      <span>ESTATESPHERE</span>
      <span>•</span>
      <span>DWELLORA RESIDENCES</span>
    </div>
    <div class="action-bar-buttons">
      <button class="btn-action" onclick="window.print()">
        🖨️ Save as PDF / Print Factsheet
      </button>
      <a class="btn-action-outline" href="/assets/Dwellora_Master_Brochure.pdf" download="Dwellora_Master_Brochure.pdf">
        📄 Download Master Brochure (PDF)
      </a>
      <button class="btn-action-outline" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </header>

  <!-- Printable Brochure Sheet -->
  <main class="sheet-wrapper">
    <header class="brochure-header">
      <div>
        <div class="brand-title">ESTATESPHERE</div>
        <div class="brand-subtitle">THE DWELLORA COLLECTION • INDORE</div>
      </div>
      <div class="header-meta">
        <div><b>RERA REG:</b> PRM/MP/RERA/2026/044</div>
        <div><b>LOCATION:</b> Super Corridor, Indore (M.P.)</div>
        <div><b>TARGET COMPLETION:</b> ${apt.completion}</div>
      </div>
    </header>

    <!-- Unit Hero Identity -->
    <section class="unit-hero">
      <div>
        <h1 class="unit-number">Residence ${apt.apartmentNumber}</h1>
        <div class="unit-typology">${apt.typology} • ${apt.block} • ${apt.floor}</div>
      </div>
      <div style="text-align: right;">
        <span class="unit-status-badge">${apt.status === 'AVAILABLE' ? '• AVAILABLE FOR ALLOTMENT' : apt.status}</span>
        <div style="font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#0f172a; margin-top:8px;">
          ${apt.price}
        </div>
      </div>
    </section>

    <!-- Key Metrics Grid -->
    <section class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">BEDROOMS</div>
        <div class="metric-val">${apt.bedrooms}</div>
        <div class="metric-sub">Luxury En-Suites</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">INTERIOR AREA</div>
        <div class="metric-val">${apt.areaSqm} M²</div>
        <div class="metric-sub">${apt.areaSqft.toLocaleString()} Sq.Ft.</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">TERRACE AREA</div>
        <div class="metric-val">${apt.terraceArea} M²</div>
        <div class="metric-sub">${Math.round(apt.terraceArea * 10.7639)} Sq.Ft.</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">PARKING BAYS</div>
        <div class="metric-val">2</div>
        <div class="metric-sub">Covered + EV Ready</div>
      </div>
    </section>

    <!-- Vector Floor Plan -->
    <section class="floorplan-section">
      <h2 class="section-title">
        Architectural Suite Layout
        <span>Scaled Vector Layout Plan (${apt.bedrooms}-Bedroom Suite)</span>
      </h2>
      ${floorPlanSvg}
    </section>

    <!-- Detailed Specifications Table -->
    <section>
      <h2 class="section-title">
        Engineering & Material Specifications
        <span>Master Craftsmanship Schedule</span>
      </h2>
      <table class="specs-table">
        <thead>
          <tr>
            <th style="width: 25%;">Domain</th>
            <th style="width: 75%;">Architectural Finishes & Luxury Inclusions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Flooring & Surfaces</b></td>
            <td>Bookmatched Italian Botticino / Statuario marble in foyer, living salon, and dining suite. European engineered white oak herringbone timber flooring in master suite.</td>
          </tr>
          <tr>
            <td><b>Glazing & Facade</b></td>
            <td>Full-height Schuco / Reynaers German structural facade with double-glazed acoustic laminated glass offering 42dB ambient noise isolation.</td>
          </tr>
          <tr>
            <td><b>Gourmet Kitchen</b></td>
            <td>Custom Italian Poliform / Poggenpohl modular cabinetry with quartz countertops, integrated Miele induction hob, built-in pyrolytic oven, and island extractor.</td>
          </tr>
          <tr>
            <td><b>En-Suite Bathrooms</b></td>
            <td>Antonio Lupi freestanding soaking bathtub in master suite, Dornbracht brushed brassware, Duravit Sensowash intelligent commodes, and bookmatched travertine stone.</td>
          </tr>
          <tr>
            <td><b>HVAC & Air Purity</b></td>
            <td>Daikin VRV IV multi-zone climate control with hospital-grade MERV-13 air filtration and concealed low-velocity ceiling plenums.</td>
          </tr>
          <tr>
            <td><b>Home Automation</b></td>
            <td>Integrated Lutron HomeWorks circadian lighting system, motorized acoustic drapery automation, and 24/7 video concierge access.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Estate Amenities & Highlights -->
    <section class="highlights-grid">
      <div class="highlight-box">
        <h4>ESTATE PRIVILEGES & CLUB DWELLORA</h4>
        <ul>
          <li>50-meter temperature-controlled Olympic-length horizon infinity pool</li>
          <li>Technogym-equipped wellness suite with private reformer studio</li>
          <li>Hydrotherapy spa pavilion with cedar sauna & herbal steam rooms</li>
          <li>Private 16-seat Dolby Atmos cinema screening room & library salon</li>
        </ul>
      </div>
      <div class="highlight-box">
        <h4>SECURITY & CONCIERGE INFRASTRUCTURE</h4>
        <ul>
          <li>Five-tier biometric security with facial recognition lobby ingress</li>
          <li>Direct private elevator access to dedicated residence vestibule</li>
          <li>Subterranean license plate recognition (LPR) automated parking</li>
          <li>24/7 white-glove concierge, package management & valet service</li>
        </ul>
      </div>
    </section>

    <!-- Footer & Credentials -->
    <footer class="brochure-footer">
      <div class="footer-left">
        <div><b>Developer:</b> EstateSphere Developers Pvt. Ltd. | <b>Project:</b> Dwellora Residences</div>
        <div>Super Corridor, Near Airport Road, Indore (M.P.) 452005 | Email: luxury@estatesphere.com</div>
      </div>
      <div style="text-align: right;">
        <div><b>Official Inquiries:</b> +91 98260 00000</div>
        <div>estatesphere.vercel.app &bull; MP RERA Reg: PRM/MP/RERA/2026/044</div>
      </div>
    </footer>
  </main>

  <script>
    // Automatically trigger system Print / Save as PDF dialog after 350ms
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

