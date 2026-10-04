# FINRISK AI — System Architecture & Methodology
*S&P Global & CRISIL Campus Hackathon 2026*

## 1. System Architecture Diagram

```mermaid
graph TD
    subgraph Data Sources [Data Layer - Outside & Sampled]
        A1[Banking Transactions CSV]
        A2[Financial PhraseBank Corpus]
        A3[Reuters / CNBC / Guardian News]
        A4[Twitter Stock Sentiment Logs]
    end

    subgraph Backend [FastAPI Intelligence Engine]
        B1[Ingestion & Loader Pipeline]
        B2[(SQLite Database finrisk.sqlite3)]
        B3[NLP Lexical Sentiment Analyzer]
        B4[Multi-Dimensional Anomaly Detector]
        B5[Module B: Strategic Portfolio Stress Tester]
        B6[Monte Carlo VaR & CVaR Simulator]
    end

    subgraph API [REST API Layer :8000]
        C1[/api/dashboard/summary]
        C2[/api/stress-test/run & compare]
        C3[/api/transactions & headlines]
        C4[/api/risk-events]
    end

    subgraph Frontend [React + Three.js + WebXR :5173]
        D1[Executive Risk Dashboard]
        D2[Module B Stress Testing Engine]
        D3[3D Geospatial Risk Globe Three.js]
        D4[AR Spatial Risk Lens Modal HUD]
        D5[Surveillance & NLP Explorer]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2
    B2 --> B3 & B4 & B5
    B5 --> B6
    B3 & B4 & B6 --> C1 & C2 & C3 & C4
    C1 & C2 & C3 & C4 --> D1 & D2 & D3 & D4 & D5
```

---

## 2. Core Methodologies & Mathematical Formulations

### A. Module B: Strategic Portfolio Stress Testing & Monte Carlo VaR
Portfolio value $V_0 = \sum_{i=1}^{N} w_i \cdot S_i$. Under a macro stress scenario $k$, each sector $s$ receives a tailored shock $\Delta_{k,s}$:
$$V_{\text{stressed}} = \sum_{i=1}^{N} w_i \cdot S_i \cdot (1 + \Delta_{k, \text{sector}(i)})$$

#### Monte Carlo Simulation (10,000 Paths, 21 Trading Days):
For each simulation path $j \in [1, 10000]$, the daily asset returns follow:
$$r_{j, t} = \mu_{\text{shock}} + \sigma \cdot \sqrt{\Delta t} \cdot Z_t, \quad Z_t \sim \mathcal{N}(0, 1)$$
Cumulative return:
$$R_j = \prod_{t=1}^{21} (1 + r_{j, t}) - 1$$
Sorted simulated portfolio losses $L_j = -V_0 \cdot R_j$.

* **95% Value-at-Risk (VaR):**
  $$\text{VaR}_{0.95} = L_{(\lfloor 0.05 \cdot M \rfloor)}$$
* **Conditional VaR (CVaR / Expected Shortfall):**
  $$\text{CVaR}_{0.95} = \frac{1}{\lfloor 0.05 \cdot M \rfloor} \sum_{j=1}^{\lfloor 0.05 \cdot M \rfloor} L_{(j)}$$

---

### B. Multi-Dimensional Transaction Anomaly Detection
For each transaction $t$:
1. **Amount Z-Score:** $Z(t) = \frac{|x_t - \mu_x|}{\sigma_x}$
2. **Velocity Score:** $V(t) = \frac{\text{count}(\text{customer}(t))}{\max_c \text{count}(c)}$
3. **NLP Description Risk:** $S(t) = \max(0, -\text{Sentiment}(\text{desc}_t))$

Composite Risk Metric:
$$\text{RiskScore}(t) = \min\left(1.0, 0.5 \cdot \min\left(\frac{Z(t)}{3}, 1\right) + 0.3 \cdot V(t) + 0.2 \cdot S(t)\right)$$
Transactions with $\text{RiskScore} \ge 0.48$ are flagged as anomalies.

---

### C. 3D & AR Geospatial Risk Visualization
* **Three.js Core:** Interactive WebGL particle field and segmented spherical coordinate system.
* **Geodesic Coordinate Mapping:** Converts financial center latitude/longitude into 3D Cartesian coordinates:
  $$x = -R \cdot \sin(\phi) \cdot \cos(\theta), \quad y = R \cdot \cos(\phi), \quad z = R \cdot \sin(\phi) \cdot \sin(\theta)$$
* **Dynamic 3D Risk Towers:** Projected radially outward with cylinder heights and RGB emissive values proportional to local systemic risk scores.
* **AR Spatial Lens HUD:** Simulated WebXR optical pass-through overlay with targeted reticles, asset telemetry diagnostics, and real-time hedge suggestions.
