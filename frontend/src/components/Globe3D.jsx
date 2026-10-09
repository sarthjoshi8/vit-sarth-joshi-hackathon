import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// ── 22 Major Sovereign Economies with Comprehensive Macro Risk Metrics ──
const GLOBAL_COUNTRIES = [
  {
    id: 'US',
    name: 'United States',
    code: 'USA',
    flag: '🇺🇸',
    lat: 38.0,
    lon: -97.0,
    radiusDeg: 22,
    capital: 'Washington, D.C.',
    market: 'NYSE / NASDAQ / S&P 500',
    baseRisk: 38,
    severity: 'low',
    rating: 'AA+ (Stable)',
    debtGdp: '123.4%',
    yield10Y: '4.28%',
    currency: 'USD ($)',
    cdsSpread: '14.2 bps',
    varImpact: '-$18.5M',
    vulnerability: 'Treasury Term Premium Spike & Commercial Real Estate Debt',
    recommendedHedge: 'Long 2Y Treasury Swaps + Protective Equity Puts'
  },
  {
    id: 'IN',
    name: 'India',
    code: 'IND',
    flag: '🇮🇳',
    lat: 20.5937,
    lon: 78.9629,
    radiusDeg: 18,
    capital: 'New Delhi',
    market: 'NSE / BSE / NIFTY 50',
    baseRisk: 52,
    severity: 'medium',
    rating: 'BBB- (Positive)',
    debtGdp: '81.2%',
    yield10Y: '7.04%',
    currency: 'INR (₹)',
    cdsSpread: '88.5 bps',
    varImpact: '-$6.4M',
    vulnerability: 'Crude Import Inflation & FII Foreign Liquidity Outflow',
    recommendedHedge: 'Deploy USD/INR FX Forward Cover + Overweight IT/Pharma Exporters'
  },
  {
    id: 'GB',
    name: 'United Kingdom',
    code: 'GBR',
    flag: '🇬🇧',
    lat: 55.3781,
    lon: -3.436,
    radiusDeg: 9,
    capital: 'London',
    market: 'LSE / FTSE 100',
    baseRisk: 58,
    severity: 'medium',
    rating: 'AA (Stable)',
    debtGdp: '100.8%',
    yield10Y: '4.15%',
    currency: 'GBP (£)',
    cdsSpread: '22.0 bps',
    varImpact: '-$8.6M',
    vulnerability: 'Gilt Market Refinancing Risk & Service Inflation Stickiness',
    recommendedHedge: 'Enter Sonia Interest Rate Swaps + Hedge Cable (GBP/USD)'
  },
  {
    id: 'DE',
    name: 'Germany',
    code: 'DEU',
    flag: '🇩🇪',
    lat: 51.1657,
    lon: 10.4515,
    radiusDeg: 9,
    capital: 'Berlin',
    market: 'Deutsche Börse / DAX 40',
    baseRisk: 46,
    severity: 'medium',
    rating: 'AAA (Stable)',
    debtGdp: '64.5%',
    yield10Y: '2.42%',
    currency: 'EUR (€)',
    cdsSpread: '11.8 bps',
    varImpact: '-$9.1M',
    vulnerability: 'Industrial Energy Transition Costs & Export Deceleration',
    recommendedHedge: 'Long Bund Futures as Safe Haven + Sector Reallocation'
  },
  {
    id: 'JP',
    name: 'Japan',
    code: 'JPN',
    flag: '🇯🇵',
    lat: 36.2048,
    lon: 138.2529,
    radiusDeg: 12,
    capital: 'Tokyo',
    market: 'TSE / Nikkei 225',
    baseRisk: 44,
    severity: 'low',
    rating: 'A+ (Stable)',
    debtGdp: '261.3%',
    yield10Y: '1.08%',
    currency: 'JPY (¥)',
    cdsSpread: '19.5 bps',
    varImpact: '-$4.2M',
    vulnerability: 'Yen Carry Trade Unwinding & JGB Yield Curve Control Shifts',
    recommendedHedge: 'Hedge Yen Crosses with FX Risk Reversals + Short Duration JGB'
  },
  {
    id: 'CN',
    name: 'China',
    code: 'CHN',
    flag: '🇨🇳',
    lat: 35.8617,
    lon: 104.1954,
    radiusDeg: 22,
    capital: 'Beijing',
    market: 'SSE / SZSE / CSI 300',
    baseRisk: 78,
    severity: 'high',
    rating: 'A+ (Negative)',
    debtGdp: '83.6%',
    yield10Y: '2.14%',
    currency: 'CNY (¥)',
    cdsSpread: '62.4 bps',
    varImpact: '-$16.8M',
    vulnerability: 'Property Developer Liquidity Spiral & Local Gov Debt Vehicle (LGFV)',
    recommendedHedge: 'Purchase Credit Default Swap Protection + Reduce Emerging Asia Beta'
  },
  {
    id: 'BR',
    name: 'Brazil',
    code: 'BRA',
    flag: '🇧🇷',
    lat: -14.235,
    lon: -51.9253,
    radiusDeg: 20,
    capital: 'Brasília',
    market: 'B3 / Ibovespa',
    baseRisk: 77,
    severity: 'high',
    rating: 'BB (Stable)',
    debtGdp: '76.2%',
    yield10Y: '12.18%',
    currency: 'BRL (R$)',
    cdsSpread: '148.0 bps',
    varImpact: '-$11.3M',
    vulnerability: 'Fiscal Framework Credibility Strain & High Real Interest Burden',
    recommendedHedge: 'Buy DI Interest Rate Futures Put Options + BRL Collar'
  },
  {
    id: 'FR',
    name: 'France',
    code: 'FRA',
    flag: '🇫🇷',
    lat: 46.2276,
    lon: 2.2137,
    radiusDeg: 9,
    capital: 'Paris',
    market: 'Euronext Paris / CAC 40',
    baseRisk: 65,
    severity: 'high',
    rating: 'AA- (Negative)',
    debtGdp: '111.9%',
    yield10Y: '3.18%',
    currency: 'EUR (€)',
    cdsSpread: '28.4 bps',
    varImpact: '-$8.2M',
    vulnerability: 'OAT-Bund Sovereign Spread Widening & Fiscal Deficit Pressure',
    recommendedHedge: 'Hedge Sovereign Spread (Long German Bund / Short French OAT)'
  },
  {
    id: 'AU',
    name: 'Australia',
    code: 'AUS',
    flag: '🇦🇺',
    lat: -25.2744,
    lon: 133.7751,
    radiusDeg: 20,
    capital: 'Canberra',
    market: 'ASX / S&P/ASX 200',
    baseRisk: 35,
    severity: 'low',
    rating: 'AAA (Stable)',
    debtGdp: '49.8%',
    yield10Y: '4.32%',
    currency: 'AUD (A$)',
    cdsSpread: '13.1 bps',
    varImpact: '-$2.8M',
    vulnerability: 'Household Mortgage Reset & Commodity Export Price Fluctuations',
    recommendedHedge: 'Hedge AUD/USD Downside via Barrier Options'
  },
  {
    id: 'CA',
    name: 'Canada',
    code: 'CAN',
    flag: '🇨🇦',
    lat: 56.1304,
    lon: -106.3468,
    radiusDeg: 22,
    capital: 'Ottawa',
    market: 'TSX / S&P/TSX Composite',
    baseRisk: 41,
    severity: 'low',
    rating: 'AAA (Stable)',
    debtGdp: '107.1%',
    yield10Y: '3.38%',
    currency: 'CAD (C$)',
    cdsSpread: '16.5 bps',
    varImpact: '-$3.9M',
    vulnerability: 'Residential Real Estate Leverage & Household Debt Strain',
    recommendedHedge: 'Deploy Canadian Bank CDS Hedge + Short Housing Derivatives'
  },
  {
    id: 'AE',
    name: 'United Arab Emirates',
    code: 'ARE',
    flag: '🇦🇪',
    lat: 23.4241,
    lon: 53.8478,
    radiusDeg: 8,
    capital: 'Abu Dhabi',
    market: 'ADX / DFM General Index',
    baseRisk: 42,
    severity: 'low',
    rating: 'AA- (Stable)',
    debtGdp: '29.7%',
    yield10Y: '4.65%',
    currency: 'AED (د.إ)',
    cdsSpread: '38.0 bps',
    varImpact: '-$4.5M',
    vulnerability: 'Regional Geopolitical Conflict & Global Trade Route Disruption',
    recommendedHedge: 'Long Energy Volatility Futures + Multi-Currency Settlement'
  },
  {
    id: 'SG',
    name: 'Singapore',
    code: 'SGP',
    flag: '🇸🇬',
    lat: 1.3521,
    lon: 103.8198,
    radiusDeg: 6,
    capital: 'Singapore',
    market: 'SGX / Straits Times Index',
    baseRisk: 32,
    severity: 'low',
    rating: 'AAA (Stable)',
    debtGdp: '167.8%',
    yield10Y: '2.88%',
    currency: 'SGD (S$)',
    cdsSpread: '10.5 bps',
    varImpact: '-$3.1M',
    vulnerability: 'Global Trade Slowdown & Cross-Border Wealth Liquidity Shifts',
    recommendedHedge: 'Maintain Liquid Safe-Haven Treasury Reserve in High-Grade Sovereign'
  },
  {
    id: 'ZA',
    name: 'South Africa',
    code: 'ZAF',
    flag: '🇿🇦',
    lat: -30.5595,
    lon: 22.9375,
    radiusDeg: 14,
    capital: 'Pretoria',
    market: 'JSE / FTSE/JSE All Share',
    baseRisk: 82,
    severity: 'critical',
    rating: 'BB- (Stable)',
    debtGdp: '74.1%',
    yield10Y: '10.85%',
    currency: 'ZAR (R)',
    cdsSpread: '215.0 bps',
    varImpact: '-$14.2M',
    vulnerability: 'Infrastructure Bottlenecks & High External Debt Financing Costs',
    recommendedHedge: 'Execute Sovereign Risk Transfer + Hedged ZAR Put Swaptions'
  },
  {
    id: 'SA',
    name: 'Saudi Arabia',
    code: 'SAU',
    flag: '🇸🇦',
    lat: 23.8859,
    lon: 45.0792,
    radiusDeg: 14,
    capital: 'Riyadh',
    market: 'Tadawul / TASI Index',
    baseRisk: 46,
    severity: 'medium',
    rating: 'A+ (Positive)',
    debtGdp: '26.2%',
    yield10Y: '4.95%',
    currency: 'SAR (﷼)',
    cdsSpread: '47.0 bps',
    varImpact: '-$5.1M',
    vulnerability: 'Crude Oil Price Volatility & Major Capital Expenditure Strain',
    recommendedHedge: 'Oil Collar Hedging + Diversified Sovereign Sukuk Allocation'
  },
  {
    id: 'KR',
    name: 'South Korea',
    code: 'KOR',
    flag: '🇰🇷',
    lat: 35.9078,
    lon: 127.7669,
    radiusDeg: 8,
    capital: 'Seoul',
    market: 'KRX / KOSPI 200',
    baseRisk: 49,
    severity: 'medium',
    rating: 'AA (Stable)',
    debtGdp: '53.8%',
    yield10Y: '3.25%',
    currency: 'KRW (₩)',
    cdsSpread: '29.0 bps',
    varImpact: '-$5.8M',
    vulnerability: 'Semiconductor Export Cycles & Household Debt Escalation',
    recommendedHedge: 'Tech Cyclical Collar + FX Hedging on KRW/USD Options'
  },
  {
    id: 'IT',
    name: 'Italy',
    code: 'ITA',
    flag: '🇮🇹',
    lat: 41.8719,
    lon: 12.5674,
    radiusDeg: 8,
    capital: 'Rome',
    market: 'Borsa Italiana / FTSE MIB',
    baseRisk: 71,
    severity: 'high',
    rating: 'BBB (Stable)',
    debtGdp: '137.3%',
    yield10Y: '3.62%',
    currency: 'EUR (€)',
    cdsSpread: '65.2 bps',
    varImpact: '-$9.8M',
    vulnerability: 'BTP-Bund Sovereign Spread Vulnerability & Refinancing Load',
    recommendedHedge: 'Long BTP/Bund Spread Hedge + Short Italian Sovereign Debt'
  },
  {
    id: 'CH',
    name: 'Switzerland',
    code: 'CHE',
    flag: '🇨🇭',
    lat: 46.8182,
    lon: 8.2275,
    radiusDeg: 6,
    capital: 'Bern',
    market: 'SIX Swiss Exchange / SMI',
    baseRisk: 24,
    severity: 'low',
    rating: 'AAA (Stable)',
    debtGdp: '37.8%',
    yield10Y: '0.62%',
    currency: 'CHF (Fr)',
    cdsSpread: '9.2 bps',
    varImpact: '-$1.9M',
    vulnerability: 'Safe-Haven Currency Appreciation Squeezing Export Competitiveness',
    recommendedHedge: 'Allocate High-Conviction Core Reserve in Swiss Sovereign Assets'
  },
  {
    id: 'MX',
    name: 'Mexico',
    code: 'MEX',
    flag: '🇲🇽',
    lat: 23.6345,
    lon: -102.5528,
    radiusDeg: 14,
    capital: 'Mexico City',
    market: 'BMV / S&P/BMV IPC',
    baseRisk: 67,
    severity: 'high',
    rating: 'BBB (Stable)',
    debtGdp: '49.4%',
    yield10Y: '9.85%',
    currency: 'MXN ($)',
    cdsSpread: '98.5 bps',
    varImpact: '-$7.8M',
    vulnerability: 'Pemex Contingent Liabilities & US Trade Tariff Exposure',
    recommendedHedge: 'Long USD/MXN Call Options + Spread Compression Hedge'
  },
  {
    id: 'AR',
    name: 'Argentina',
    code: 'ARG',
    flag: '🇦🇷',
    lat: -38.4161,
    lon: -63.6167,
    radiusDeg: 16,
    capital: 'Buenos Aires',
    market: 'BYMA / S&P Merval',
    baseRisk: 89,
    severity: 'critical',
    rating: 'CCC (Negative)',
    debtGdp: '88.4%',
    yield10Y: '24.50%',
    currency: 'ARS ($)',
    cdsSpread: '1420 bps',
    varImpact: '-$15.9M',
    vulnerability: 'Hyperinflationary Pressure & FX Reserve Depletion',
    recommendedHedge: 'Execute Complete Sovereign Quarantine & FX Ring-Fencing'
  },
  {
    id: 'ID',
    name: 'Indonesia',
    code: 'IDN',
    flag: '🇮🇩',
    lat: -0.7893,
    lon: 113.9213,
    radiusDeg: 16,
    capital: 'Jakarta',
    market: 'IDX / IDX Composite',
    baseRisk: 54,
    severity: 'medium',
    rating: 'BBB (Stable)',
    debtGdp: '39.1%',
    yield10Y: '6.78%',
    currency: 'IDR (Rp)',
    cdsSpread: '72.0 bps',
    varImpact: '-$4.8M',
    vulnerability: 'Commodity Demand Shock & Currency Depreciation Vulnerability',
    recommendedHedge: 'Hedge Rupiah FX Swaps + Nickel/Resource Derivative Overlay'
  },
  {
    id: 'ES',
    name: 'Spain',
    code: 'ESP',
    flag: '🇪🇸',
    lat: 40.4637,
    lon: -3.7492,
    radiusDeg: 8,
    capital: 'Madrid',
    market: 'BME / IBEX 35',
    baseRisk: 58,
    severity: 'medium',
    rating: 'A (Stable)',
    debtGdp: '107.7%',
    yield10Y: '3.12%',
    currency: 'EUR (€)',
    cdsSpread: '34.0 bps',
    varImpact: '-$5.9M',
    vulnerability: 'Public Debt Service Burden & Mediterranean Drought Disruption',
    recommendedHedge: 'Underweight Peripheral EU Sovereign Spread & Buy Euro Stoxx Put'
  },
  {
    id: 'NG',
    name: 'Nigeria',
    code: 'NGA',
    flag: '🇳🇬',
    lat: 9.082,
    lon: 8.6753,
    radiusDeg: 12,
    capital: 'Abuja',
    market: 'NGX / All Share Index',
    baseRisk: 84,
    severity: 'critical',
    rating: 'B- (Stable)',
    debtGdp: '42.0%',
    yield10Y: '18.40%',
    currency: 'NGN (₦)',
    cdsSpread: '620 bps',
    varImpact: '-$12.3M',
    vulnerability: 'Foreign Exchange Illiquidity & Inflationary Devaluation Spiral',
    recommendedHedge: 'Quarantine Direct Exposure + Shift to USD-Denominated Sukuk'
  }
];

// Helper: Convert Lat/Lon to 3D Cartesian Vector
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Helper: Convert Vector3 back to Lat/Lon on sphere
function vector3ToLatLon(v, radius) {
  const phi = Math.acos(Math.max(-1, Math.min(1, v.y / radius)));
  const lat = 90 - (phi * (180 / Math.PI));
  const theta = Math.atan2(v.z, -v.x);
  let lon = (theta * (180 / Math.PI)) - 180;
  while (lon < -180) lon += 360;
  while (lon > 180) lon -= 360;
  return { lat, lon };
}

// Great-circle angular distance in degrees
function angularDistanceDeg(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * (180 / Math.PI);
}

// ── GENERATE HIGH-TECH CONTINENTS & COUNTRIES CANVASS TEXTURE ──
function createWorldMapTexture() {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Deep Obsidian Ocean Background
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
  oceanGrad.addColorStop(0, '#040813');
  oceanGrad.addColorStop(0.5, '#071120');
  oceanGrad.addColorStop(1, '#040813');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Graticule: Latitude & Longitude Grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
  for (let lon = -180; lon <= 180; lon += 15) {
    const x = ((lon + 180) / 360) * W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 15) {
    const y = ((90 - lat) / 180) * H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Highlight Equator & Prime Meridian
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.28)';
  // Equator
  ctx.beginPath();
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();
  // Prime Meridian
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();

  // Helper to draw lat/lon polygon
  function drawLandPolygon(pts, fillStyle = '#0e2440', strokeStyle = '#00f2fe', lineWidth = 2) {
    if (!pts || pts.length < 3) return;
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const [lat, lon] = pts[i];
      const px = ((lon + 180) / 360) * W;
      const py = ((90 - lat) / 180) * H;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = strokeStyle;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  // 3. World Continents & Landmass Polygons
  const CONTINENTS = [
    // North America (Alaska, Canada, USA, Mexico, Central America)
    [
      [71, -156], [71, -128], [69, -100], [60, -64], [53, -56], [47, -53], [44, -66], [41, -70],
      [35, -75], [30, -81], [25, -80], [25, -82], [30, -88], [29, -95], [26, -97], [22, -97],
      [18, -93], [16, -88], [15, -83], [10, -83], [8, -77], [7, -81], [10, -86], [14, -92],
      [16, -98], [20, -105], [28, -112], [32, -117], [37, -122], [47, -124], [54, -130],
      [59, -140], [57, -152], [65, -168], [71, -156]
    ],
    // Greenland
    [
      [82, -40], [83, -25], [77, -18], [70, -22], [65, -37], [60, -43], [65, -52], [76, -68],
      [81, -60], [82, -40]
    ],
    // South America
    [
      [12, -72], [10, -62], [6, -58], [4, -51], [-1, -48], [-5, -35], [-12, -37], [-23, -42],
      [-32, -52], [-35, -57], [-42, -63], [-52, -68], [-55, -67], [-53, -73], [-45, -74],
      [-36, -73], [-24, -70], [-18, -71], [-5, -81], [1, -79], [8, -77], [12, -72]
    ],
    // Europe & Asia (Eurasian Landmass)
    [
      [71, 28], [70, 18], [62, 5], [58, 6], [54, 9], [53, 5], [51, 2], [49, -1], [46, -1],
      [43, -9], [36, -6], [37, -2], [43, 3], [44, 8], [41, 15], [38, 16], [40, 18], [45, 13],
      [44, 28], [47, 30], [45, 38], [55, 38], [65, 41], [72, 70], [76, 100], [73, 140],
      [66, 170], [60, 165], [55, 155], [58, 140], [45, 135], [40, 128], [35, 129], [38, 122],
      [32, 121], [22, 114], [21, 108], [11, 108], [1, 104], [10, 99], [22, 91], [22, 88],
      [13, 80], [8, 77], [15, 74], [23, 68], [25, 62], [25, 56], [15, 52], [12, 45], [28, 34],
      [32, 35], [36, 36], [41, 29], [46, 30], [55, 40], [65, 40], [70, 60], [71, 28]
    ],
    // British Isles
    [
      [58, -5], [58, -2], [54, 0], [51, 1], [50, -5], [52, -5], [55, -6], [58, -5]
    ],
    // Ireland
    [
      [55, -7], [54, -6], [52, -6], [51, -10], [54, -10], [55, -7]
    ],
    // Africa
    [
      [35, -6], [37, 10], [32, 25], [31, 32], [28, 34], [22, 38], [12, 44], [11, 51],
      [2, 46], [-5, 40], [-15, 40], [-25, 33], [-34, 18], [-34, 26], [-28, 16], [-18, 12],
      [-5, 12], [4, 9], [5, -1], [5, -4], [6, -11], [11, -15], [15, -17], [21, -17], [28, -13],
      [35, -6]
    ],
    // Madagascar
    [
      [-12, 49], [-16, 50], [-25, 47], [-25, 44], [-16, 44], [-12, 49]
    ],
    // Japan
    [
      [45, 142], [43, 145], [38, 141], [35, 140], [33, 131], [34, 133], [37, 137], [40, 140], [45, 142]
    ],
    // Australia
    [
      [-12, 132], [-12, 136], [-15, 145], [-23, 151], [-32, 153], [-37, 150], [-38, 145],
      [-35, 136], [-32, 129], [-35, 117], [-22, 114], [-15, 125], [-12, 132]
    ],
    // New Zealand (North & South)
    [
      [-35, 174], [-41, 175], [-46, 168], [-44, 169], [-38, 175], [-35, 174]
    ],
    // Indonesia & SE Asia Islands
    [
      [5, 96], [3, 98], [-5, 105], [-6, 106], [-8, 115], [-8, 112], [-6, 106], [-2, 100], [5, 96]
    ],
    [
      [4, 115], [1, 118], [-4, 115], [-2, 110], [1, 109], [4, 115]
    ]
  ];

  // Draw landmasses with glowing cyber borders
  CONTINENTS.forEach(poly => {
    drawLandPolygon(poly, '#0c203b', '#00f2fe', 2.2);
  });

  // 4. Country Border Dividers across Continents
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
  ctx.setLineDash([4, 4]);

  const BORDERS = [
    // US / Canada Border (49th Parallel)
    [[49, -124], [49, -95], [45, -82], [45, -71]],
    // US / Mexico Border
    [[32.5, -117], [31.7, -106], [26, -97]],
    // Brazil / Argentina & Southern Cone
    [[-25, -54], [-30, -57], [-34, -58]],
    // Europe Internal (France / Germany / Alps)
    [[48, -1], [49, 7], [50, 14]],
    [[44, 7], [46, 7], [47, 10]],
    // India / Pakistan & Northern Border
    [[24, 68], [31, 74], [35, 76]],
    // India / China Himalayan Divide
    [[35, 76], [31, 80], [27, 88], [28, 96]],
    // China / Russia Amur Divider
    [[50, 120], [48, 131], [48, 135]],
    // Middle East / Arabia
    [[32, 35], [30, 48], [24, 55]],
    // Australia State Dividers
    [[-26, 114], [-26, 153]],
    [[-12, 138], [-38, 138]]
  ];

  BORDERS.forEach(line => {
    ctx.beginPath();
    line.forEach(([lat, lon], idx) => {
      const px = ((lon + 180) / 360) * W;
      const py = ((90 - lat) / 180) * H;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // 5. High-Tech Hex Dotted Matrix on Continents
  ctx.fillStyle = 'rgba(0, 242, 254, 0.15)';
  for (let lon = -170; lon <= 170; lon += 6) {
    for (let lat = -55; lat <= 70; lat += 6) {
      // Sample if on continent bounds (roughly)
      const px = ((lon + 180) / 360) * W;
      const py = ((90 - lat) / 180) * H;
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. Direct Country Codes & Sovereign Name Stamps
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#67e8f9';
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 6;
  ctx.textAlign = 'center';

  GLOBAL_COUNTRIES.forEach(c => {
    const px = ((c.lon + 180) / 360) * W;
    const py = ((90 - c.lat) / 180) * H;
    ctx.fillText(`${c.flag} ${c.code}`, px, py + 4);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function Globe3D({ onSelectHub, selectedScenario = 'recession', height = 480, compact = false }) {
  const mountRef = useRef(null);

  // Active States
  const [countries, setCountries] = useState(GLOBAL_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState(GLOBAL_COUNTRIES[0]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0, visible: false });
  const [rotationSpeed, setRotationSpeed] = useState(0.002);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'actions' | 'dossier'

  // Refs for 3D synchronization
  const selectedCountryRef = useRef(GLOBAL_COUNTRIES[0]);
  const hoveredCountryRef = useRef(null);
  const worldGroupRef = useRef(null);
  const audioContextRef = useRef(null);

  // Play subtle electronic sonar ping on new country target lock
  const playPing = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Sync ref
  useEffect(() => {
    selectedCountryRef.current = selectedCountry;
  }, [selectedCountry]);

  // Set action notice with auto-dismiss
  const triggerNotice = (msg, type = 'success') => {
    setActionNotice({ msg, type });
    setTimeout(() => {
      setActionNotice(null);
    }, 4500);
  };

  // ── ACTION 1: Simulate Macro Shock on this country ──
  const handleSimulateShock = (country) => {
    const shockSeverity = country.severity === 'critical' ? 'Catastrophic Debt Default' :
                          country.severity === 'high' ? '180bps Sovereign Spread Widening' :
                          '120bps Bond Yield Spike & Currency Pressure';

    setCountries(prev => prev.map(c => {
      if (c.id === country.id) {
        return {
          ...c,
          baseRisk: Math.min(99, c.baseRisk + 18),
          severity: 'critical',
          shockActive: true,
          varImpact: `-$${(parseFloat(c.varImpact.replace(/[^0-9.]/g, '')) * 1.5).toFixed(1)}M`
        };
      }
      return c;
    }));

    const updated = {
      ...country,
      baseRisk: Math.min(99, country.baseRisk + 18),
      severity: 'critical',
      shockActive: true
    };
    setSelectedCountry(updated);

    triggerNotice(`⚠️ MACRO SHOCK SIMULATED: ${country.name} hit with ${shockSeverity}. Drawdown exposure amplified.`, 'danger');
    if (onSelectHub) onSelectHub(updated);
  };

  // ── ACTION 2: Deploy Sovereign CDS / Currency Hedge ──
  const handleDeployHedge = (country) => {
    setCountries(prev => prev.map(c => {
      if (c.id === country.id) {
        return {
          ...c,
          baseRisk: Math.max(18, c.baseRisk - 25),
          severity: c.baseRisk - 25 > 60 ? 'medium' : 'low',
          isHedged: true,
          shockActive: false,
          varImpact: `-$${(parseFloat(c.varImpact.replace(/[^0-9.]/g, '')) * 0.45).toFixed(1)}M`
        };
      }
      return c;
    }));

    const updated = {
      ...country,
      baseRisk: Math.max(18, country.baseRisk - 25),
      severity: country.baseRisk - 25 > 60 ? 'medium' : 'low',
      isHedged: true,
      shockActive: false
    };
    setSelectedCountry(updated);

    triggerNotice(`🛡️ SOVEREIGN HEDGE DEPLOYED: $25M Notional CDS + FX Collar executed for ${country.name}. Risk curtailed by 45%.`, 'success');
    if (onSelectHub) onSelectHub(updated);
  };

  // ── ACTION 3: Quarantine Financial Corridors (Capital Controls) ──
  const handleToggleQuarantine = (country) => {
    const nextQuarantine = !country.quarantined;
    setCountries(prev => prev.map(c => {
      if (c.id === country.id) {
        return { ...c, quarantined: nextQuarantine };
      }
      return c;
    }));

    const updated = { ...country, quarantined: nextQuarantine };
    setSelectedCountry(updated);

    if (nextQuarantine) {
      triggerNotice(`🛑 CAPITAL QUARANTINE ENFORCED: Spillover corridors from ${country.name} isolated to prevent systemic contagion.`, 'warning');
    } else {
      triggerNotice(`🌐 CORRIDOR RECONNECTED: Normal liquidity channels restored for ${country.name}.`, 'info');
    }
  };

  // ── Quick Select and Rotate Globe to Focus on Country ──
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    if (onSelectHub) onSelectHub(country);
    playPing();

    // Rotate globe smoothly toward target country
    if (worldGroupRef.current) {
      // Calculate target rotation to bring country to front (+Z)
      const targetY = -((country.lon + 90) * Math.PI / 180);
      const targetX = (country.lat * Math.PI / 180) * 0.4;
      worldGroupRef.current.rotation.y = targetY;
      worldGroupRef.current.rotation.x = targetX;
    }
  };

  // ── Three.js Lifecycle ──
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const hVal = typeof height === 'number' ? height : parseInt(height, 10) || 480;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / hVal, 0.1, 1000);
    camera.position.z = 240;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, hVal);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group for rotating world
    const worldGroup = new THREE.Group();
    worldGroupRef.current = worldGroup;
    scene.add(worldGroup);

    // 1. Globe Core with High-Fidelity World Map Texture
    const globeRadius = 75;
    const worldTexture = createWorldMapTexture();
    const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      map: worldTexture,
      bumpScale: 0.05,
      specular: 0x00f2fe,
      shininess: 35,
      emissive: 0x050c18,
      emissiveIntensity: 0.6
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    worldGroup.add(globeMesh);

    // 2. Futuristic Cyber Graticule Wireframe
    const wireGeo = new THREE.SphereGeometry(globeRadius + 0.6, 36, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    worldGroup.add(wireMesh);

    // 3. Glowing Atmosphere Halo
    const haloGeo = new THREE.SphereGeometry(globeRadius + 8, 36, 36);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x4361ee,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    worldGroup.add(haloMesh);

    // 4. Background Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 800;
      starPositions[i + 1] = (Math.random() - 0.5) * 800;
      starPositions[i + 2] = (Math.random() - 0.5) * 800;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x88c0d0,
      size: 1.5,
      transparent: true,
      opacity: 0.6
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. 3D Country Sovereign Beacons & Hitboxes
    const countryHitMeshes = [];
    const countryBeacons = [];

    countries.forEach((country) => {
      const pos = latLonToVector3(country.lat, country.lon, globeRadius);

      const colorHex = country.severity === 'critical' ? 0xff3366 :
                       country.severity === 'high' ? 0xf97316 :
                       country.severity === 'medium' ? 0xffb703 : 0x00f59b;

      // Base territory ring
      const ringGeo = new THREE.RingGeometry(2.0, 4.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.008));
      ring.lookAt(pos.clone().multiplyScalar(2));
      worldGroup.add(ring);

      // Sovereign Risk Tower (3D laser beacon)
      const towerHeight = 8 + (country.baseRisk * 0.35);
      const towerGeo = new THREE.CylinderGeometry(0.7, 1.6, towerHeight, 12);
      const towerMat = new THREE.MeshPhongMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.65,
        transparent: true,
        opacity: 0.85
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.copy(pos.clone().multiplyScalar(1 + (towerHeight / 2) / globeRadius));
      tower.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      worldGroup.add(tower);

      // Apex Marker (diamond/octahedron)
      const apexGeo = new THREE.OctahedronGeometry(1.6);
      const apexMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const apex = new THREE.Mesh(apexGeo, apexMat);
      apex.position.copy(pos.clone().multiplyScalar(1 + towerHeight / globeRadius));
      worldGroup.add(apex);

      // Interactive Invisible Hitbox for easy hover & click
      const hitGeo = new THREE.SphereGeometry(6.5, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitbox = new THREE.Mesh(hitGeo, hitMat);
      hitbox.position.copy(pos);
      hitbox.userData = { country };
      worldGroup.add(hitbox);
      countryHitMeshes.push(hitbox);

      countryBeacons.push({ country, tower, ring, apex, pos });
    });

    // 6. Dynamic Holographic Target Scanner / Reticle
    const reticleGeo = new THREE.RingGeometry(5.0, 6.2, 32);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.visible = false;
    worldGroup.add(reticleMesh);

    // Vertical Scanner Laser Pillar
    const laserGeo = new THREE.CylinderGeometry(0.4, 0.4, 45, 8);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.6
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.visible = false;
    worldGroup.add(laserMesh);

    // 7. Global Financial & Trade Risk Corridors (Contagion Arcs)
    const arcConnections = [
      ['US', 'GB'],
      ['GB', 'DE'],
      ['DE', 'FR'],
      ['DE', 'IT'],
      ['US', 'JP'],
      ['JP', 'KR'],
      ['US', 'BR'],
      ['IN', 'AE'],
      ['AE', 'GB'],
      ['IN', 'SG'],
      ['SG', 'CN'],
      ['CN', 'AU'],
      ['CN', 'BR'],
      ['US', 'CA'],
      ['US', 'MX'],
      ['ZA', 'GB'],
      ['SA', 'AE']
    ];

    const arcLines = [];
    arcConnections.forEach(([id1, id2]) => {
      const c1 = countries.find(c => c.id === id1);
      const c2 = countries.find(c => c.id === id2);
      if (!c1 || !c2) return;

      const v1 = latLonToVector3(c1.lat, c1.lon, globeRadius);
      const v2 = latLonToVector3(c2.lat, c2.lon, globeRadius);
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const midLen = mid.length();
      mid.normalize().multiplyScalar(midLen + 24);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x4361ee,
        transparent: true,
        opacity: 0.45
      });
      const line = new THREE.Line(arcGeo, arcMat);
      line.userData = { id1, id2 };
      worldGroup.add(line);
      arcLines.push(line);
    });

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.8);
    dirLight1.position.set(120, 100, 120);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4361ee, 1.2);
    dirLight2.position.set(-120, -60, -90);
    scene.add(dirLight2);

    // 9. Mouse Interaction & Raycasting (Pointing Recognizer)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    // Pointing detection: calculates exact country under cursor
    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        worldGroup.rotation.y += deltaX * 0.005;
        worldGroup.rotation.x += deltaY * 0.005;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }

      // Raycast for pointing detection
      raycaster.setFromCamera(mouse, camera);

      // Check direct beacon hit first
      let recognized = null;
      const hitIntersects = raycaster.intersectObjects(countryHitMeshes);

      if (hitIntersects.length > 0) {
        recognized = hitIntersects[0].object.userData.country;
      } else {
        // Check globe sphere intersection & inverse-project lat/lon
        const globeHits = raycaster.intersectObject(globeMesh);
        if (globeHits.length > 0) {
          const invMatrix = worldGroup.matrixWorld.clone().invert();
          const localPoint = globeHits[0].point.clone().applyMatrix4(invMatrix);
          const { lat, lon } = vector3ToLatLon(localPoint, globeRadius);

          // Find closest country
          let closest = null;
          let minDistance = Infinity;

          countries.forEach(c => {
            const dist = angularDistanceDeg(lat, lon, c.lat, c.lon);
            const radiusLimit = c.radiusDeg || 14;
            if (dist < radiusLimit && dist < minDistance) {
              minDistance = dist;
              closest = c;
            }
          });

          if (closest) {
            recognized = closest;
          }
        }
      }

      if (recognized) {
        // Pointing successfully recognized country!
        if (hoveredCountryRef.current?.id !== recognized.id) {
          hoveredCountryRef.current = recognized;
          setHoveredCountry(recognized);
          playPing();
        }
        setPointerPos({
          x: clientX - rect.left,
          y: clientY - rect.top,
          visible: true
        });

        // Position 3D Target Reticle at recognized country
        const cPos = latLonToVector3(recognized.lat, recognized.lon, globeRadius);
        reticleMesh.position.copy(cPos.clone().multiplyScalar(1.02));
        reticleMesh.lookAt(cPos.clone().multiplyScalar(2));
        reticleMesh.visible = true;

        laserMesh.position.copy(cPos.clone().multiplyScalar(1.15));
        laserMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cPos.clone().normalize());
        laserMesh.visible = true;
      } else {
        if (hoveredCountryRef.current !== null) {
          hoveredCountryRef.current = null;
          setHoveredCountry(null);
        }
        setPointerPos(prev => ({ ...prev, visible: false }));
        reticleMesh.visible = false;
        laserMesh.visible = false;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      if (hoveredCountryRef.current) {
        setSelectedCountry(hoveredCountryRef.current);
        if (onSelectHub) onSelectHub(hoveredCountryRef.current);
        playPing();
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onClick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        worldGroup.rotation.y += rotationSpeed;
      }

      const elapsed = clock.getElapsedTime();

      // Atmospheric pulse
      haloMesh.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.015);
      starField.rotation.y = elapsed * 0.0003;

      // Pulse reticle ring
      if (reticleMesh.visible) {
        reticleMesh.scale.setScalar(1 + Math.sin(elapsed * 6) * 0.12);
      }

      // Update contagion arc colors based on quarantined status
      arcLines.forEach(line => {
        const { id1, id2 } = line.userData;
        const c1 = countries.find(c => c.id === id1);
        const c2 = countries.find(c => c.id === id2);
        if (c1?.quarantined || c2?.quarantined) {
          line.material.color.setHex(0xff3366);
          line.material.opacity = 0.85;
        } else if (c1?.isHedged || c2?.isHedged) {
          line.material.color.setHex(0x00f59b);
          line.material.opacity = 0.6;
        } else {
          line.material.color.setHex(0x4361ee);
          line.material.opacity = 0.45;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('click', onClick);
      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [countries, rotationSpeed, soundEnabled]);

  const activeCountry = hoveredCountry || selectedCountry;

  return (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: compact ? '14px' : '20px 24px' }}>
      {/* ── Top Bar: Title & Controls ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: compact ? '15px' : '17px', fontWeight: 800 }}>
            <span>🌐</span> 3D Sovereign Risk Globe &amp; Country Recognizer
          </h3>
          {!compact && (
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Interactive planetary risk surveillance. Point or hover at any country to recognize sovereign vulnerabilities and trigger real-time actions.
            </p>
          )}
        </div>

        {/* Global Action & Control Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={`btn ${soundEnabled ? 'btn-secondary' : 'btn-secondary'}`}
            style={{ padding: '5px 10px', fontSize: '11px', opacity: soundEnabled ? 1 : 0.6 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Sonar Audio Ping"
          >
            {soundEnabled ? '🔊 Sonar On' : '🔇 Muted'}
          </button>
          <button
            className={`btn ${rotationSpeed === 0 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '5px 10px', fontSize: '11px' }}
            onClick={() => setRotationSpeed(rotationSpeed === 0 ? 0.002 : 0)}
          >
            {rotationSpeed === 0 ? '▶ Resume Rotation' : '⏸ Pause'}
          </button>
        </div>
      </div>

      {/* ── Quick Sovereign Country Selector Pills ── */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '10px', scrollbarWidth: 'none' }}>
        {countries.map(c => {
          const isSelected = selectedCountry?.id === c.id;
          const isHovered = hoveredCountry?.id === c.id;
          const color = c.severity === 'critical' ? 'var(--accent-rose)' :
                        c.severity === 'high' ? 'var(--accent-amber)' :
                        c.severity === 'medium' ? 'var(--accent-cyan)' : 'var(--accent-emerald)';

          return (
            <button
              key={c.id}
              onClick={() => handleSelectCountry(c)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: isSelected ? 800 : 500,
                border: isSelected ? `1px solid ${color}` : '1px solid var(--border-glass)',
                background: isSelected ? 'rgba(0, 242, 254, 0.15)' : isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(10, 16, 28, 0.6)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
              {c.isHedged && <span title="Hedged">🛡️</span>}
              {c.shockActive && <span title="Shock Active">⚠️</span>}
              {c.quarantined && <span title="Quarantined">🛑</span>}
            </button>
          );
        })}
      </div>

      {/* ── Main 3D Canvas Mount with HUD Pointer Overlay ── */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: typeof height === 'number' ? `${height}px` : height,
            cursor: 'grab',
            background: 'radial-gradient(circle at center, #0a1324 0%, #030712 100%)',
          }}
        />

        {/* Dynamic Holographic Cursor Floating Card */}
        {pointerPos.visible && hoveredCountry && (
          <div
            style={{
              position: 'absolute',
              left: `${Math.min(pointerPos.x + 18, mountRef.current?.clientWidth - 260 || 0)}px`,
              top: `${Math.max(16, pointerPos.y - 40)}px`,
              pointerEvents: 'none',
              background: 'rgba(6, 12, 24, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--accent-cyan)',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
              borderRadius: '8px',
              padding: '10px 14px',
              zIndex: 25,
              minWidth: '220px',
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{hoveredCountry.flag}</span> {hoveredCountry.name}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {hoveredCountry.code}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Risk Index: <strong style={{ color: hoveredCountry.severity === 'critical' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>{hoveredCountry.baseRisk}/100</strong>
              <span style={{ marginLeft: '8px', fontSize: '10px', textTransform: 'uppercase' }}>({hoveredCountry.severity})</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              10Y Yield: <strong>{hoveredCountry.yield10Y}</strong> • Rating: <strong>{hoveredCountry.rating}</strong>
            </div>
            <div style={{ marginTop: '5px', fontSize: '9px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🎯</span> Click globe or use Action Bar below
            </div>
          </div>
        )}

        {/* Status Toast / Alert Notice */}
        {actionNotice && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: actionNotice.type === 'danger' ? 'rgba(255, 51, 102, 0.92)' :
                          actionNotice.type === 'warning' ? 'rgba(255, 183, 3, 0.92)' :
                          'rgba(0, 245, 155, 0.92)',
              color: actionNotice.type === 'warning' ? '#05080e' : '#fff',
              padding: '8px 18px',
              borderRadius: '24px',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'slideDown 0.2s ease-out',
            }}
          >
            <span>{actionNotice.msg}</span>
          </div>
        )}

        {/* Corner Target Recognition Reticle Badge */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(10, 16, 28, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-glass)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: hoveredCountry ? 'var(--accent-cyan)' : 'var(--accent-emerald)', animation: 'pulse 1.5s infinite' }}></span>
          <span style={{ color: 'var(--text-muted)' }}>RECOGNITION:</span>
          <strong style={{ color: '#fff' }}>
            {hoveredCountry ? `${hoveredCountry.flag} ${hoveredCountry.name}` : `${selectedCountry.flag} ${selectedCountry.name} (Active)`}
          </strong>
        </div>
      </div>

      {/* ── Interactive Sovereign Recognition & Action Cockpit ── */}
      <div
        style={{
          marginTop: '14px',
          background: 'rgba(10, 16, 28, 0.75)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '24px' }}>{activeCountry.flag}</span>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                {activeCountry.name} ({activeCountry.code})
              </h4>
              <span className={`badge ${activeCountry.severity}`} style={{ textTransform: 'uppercase', fontSize: '11px' }}>
                {activeCountry.severity} Risk
              </span>
              {activeCountry.isHedged && (
                <span className="badge" style={{ background: 'rgba(0, 245, 155, 0.2)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)' }}>
                  🛡️ Hedged
                </span>
              )}
              {activeCountry.shockActive && (
                <span className="badge" style={{ background: 'rgba(255, 51, 102, 0.2)', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose)' }}>
                  ⚠️ Shock Active
                </span>
              )}
              {activeCountry.quarantined && (
                <span className="badge" style={{ background: 'rgba(255, 183, 3, 0.2)', color: 'var(--accent-amber)', border: '1px solid var(--accent-amber)' }}>
                  🛑 Quarantined
                </span>
              )}
            </div>
            <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Primary Exchange: <strong style={{ color: 'var(--accent-cyan)' }}>{activeCountry.market}</strong> • Capital: {activeCountry.capital} • Currency: {activeCountry.currency}
            </div>
          </div>

          {/* Tab Switcher for Details */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '4px 10px' }}
              onClick={() => setActiveTab('overview')}
            >
              📊 Core Metrics
            </button>
            <button
              className={`btn ${activeTab === 'actions' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '4px 10px' }}
              onClick={() => setActiveTab('actions')}
            >
              ⚡ Take Actions
            </button>
            <button
              className={`btn ${activeTab === 'dossier' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '4px 10px' }}
              onClick={() => setActiveTab('dossier')}
            >
              📋 Sovereign Dossier
            </button>
          </div>
        </div>

        {/* ── TAB 1: Core Metrics Overview ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <div className="stat-card" style={{ padding: '10px 12px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>Risk Score</div>
              <div className="stat-value" style={{ fontSize: '18px', color: activeCountry.severity === 'critical' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                {activeCountry.baseRisk}/100
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>Composite Sovereign</div>
            </div>

            <div className="stat-card" style={{ padding: '10px 12px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>Credit Rating</div>
              <div className="stat-value" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                {activeCountry.rating}
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>S&amp;P / Moody's Equiv</div>
            </div>

            <div className="stat-card" style={{ padding: '10px 12px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>Debt-to-GDP</div>
              <div className="stat-value" style={{ fontSize: '18px', color: 'var(--accent-cyan)' }}>
                {activeCountry.debtGdp}
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>Public Sovereign</div>
            </div>

            <div className="stat-card" style={{ padding: '10px 12px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>10Y Benchmark Yield</div>
              <div className="stat-value" style={{ fontSize: '18px', color: 'var(--accent-emerald)' }}>
                {activeCountry.yield10Y}
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>CDS: {activeCountry.cdsSpread}</div>
            </div>

            <div className="stat-card" style={{ padding: '10px 12px' }}>
              <div className="stat-label" style={{ fontSize: '10px' }}>Spillover VaR Impact</div>
              <div className="stat-value" style={{ fontSize: '18px', color: 'var(--accent-rose)' }}>
                {activeCountry.varImpact}
              </div>
              <div className="stat-sub" style={{ fontSize: '10px' }}>1-Mo Portfolio Drawdown</div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Action Trigger Center ── */}
        {(activeTab === 'actions' || activeTab === 'overview') && (
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🎯</span> Direct Actions for {activeCountry.name}:
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Execute systemic interventions and stress shocks
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
              {/* Action 1: Simulate Macro Shock */}
              <button
                className="btn btn-secondary"
                onClick={() => handleSimulateShock(activeCountry)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '10px',
                  padding: '10px 14px',
                  background: 'rgba(255, 51, 102, 0.1)',
                  borderColor: 'rgba(255, 51, 102, 0.4)',
                  color: 'var(--accent-rose)',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '18px' }}>⚡</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800 }}>Simulate Sovereign Shock</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>Widen yield spreads &amp; devalue FX</div>
                </div>
              </button>

              {/* Action 2: Deploy CDS & FX Hedge */}
              <button
                className="btn btn-secondary"
                onClick={() => handleDeployHedge(activeCountry)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '10px',
                  padding: '10px 14px',
                  background: 'rgba(0, 245, 155, 0.1)',
                  borderColor: 'rgba(0, 245, 155, 0.4)',
                  color: 'var(--accent-emerald)',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '18px' }}>🛡️</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800 }}>Deploy CDS &amp; FX Hedge</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>Mitigate 45% of systemic VaR</div>
                </div>
              </button>

              {/* Action 3: Quarantine Spillover Corridors */}
              <button
                className="btn btn-secondary"
                onClick={() => handleToggleQuarantine(activeCountry)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '10px',
                  padding: '10px 14px',
                  background: activeCountry.quarantined ? 'rgba(255, 183, 3, 0.2)' : 'rgba(255, 183, 3, 0.1)',
                  borderColor: 'rgba(255, 183, 3, 0.4)',
                  color: 'var(--accent-amber)',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '18px' }}>🛑</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800 }}>
                    {activeCountry.quarantined ? 'Lift Corridor Quarantine' : 'Quarantine Corridors'}
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>
                    {activeCountry.quarantined ? 'Restore capital channels' : 'Block contagion spillover'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 3: Deep Sovereign Risk Dossier ── */}
        {activeTab === 'dossier' && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#fff' }}>Primary Sovereign Vulnerability:</strong> {activeCountry.vulnerability}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#fff' }}>Recommended Institutional Hedge:</strong>{' '}
              <span style={{ color: 'var(--accent-cyan)' }}>{activeCountry.recommendedHedge}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                <div>5Y CDS Default Spread:</div>
                <strong style={{ color: 'var(--accent-amber)', fontSize: '14px' }}>{activeCountry.cdsSpread}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                <div>Public Debt Burden:</div>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '14px' }}>{activeCountry.debtGdp} of GDP</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                <div>10Y Sovereign Yield:</div>
                <strong style={{ color: 'var(--accent-emerald)', fontSize: '14px' }}>{activeCountry.yield10Y}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Legend ── */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '11px', color: 'var(--text-secondary)', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>LEGEND:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff3366', display: 'inline-block' }}></span>
          Critical Risk (&gt;75)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }}></span>
          High Risk (60 - 75)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb703', display: 'inline-block' }}></span>
          Medium Risk (45 - 60)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f59b', display: 'inline-block' }}></span>
          Low Risk (&lt;45)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>Arcs:</span> Sovereign trade &amp; contagion channels (Red = Quarantined)
        </div>
      </div>
    </div>
  );
}
