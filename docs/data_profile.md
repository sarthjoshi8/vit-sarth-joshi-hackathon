# FINRISK AI — Dataset Profile & Schema Documentation
*S&P Global & CRISIL Campus Hackathon 2026*

## Overview
FINRISK AI synthesizes multimodal financial information across structured transaction logs, financial news wire reports, equity-linked social media sentiment, and expert-annotated financial phrases.

All raw datasets reside outside the repository (`~/Desktop/dataset_11`), while compressed, reproducible sample sets (totaling <2MB) are stored under `data/samples/` for automated unit testing and repository distribution compliance (<50MB git limit).

---

## 1. Financial Transactions (`financial_transactions.csv`)
* **Source:** [Kaggle: Financial Transactions Dataset](https://www.kaggle.com/datasets/cankatsrc/financial-transactions-dataset/data) by `cankatsrc`
* **Raw Size:** ~7.4 MB (50,000+ records)
* **Sample Size:** 3,000 records (`data/samples/transactions_sample.csv`)
* **Domain:** Core Banking & Operational Fraud Surveillance (Synthetic benchmark to preserve customer privacy)

### Schema
| Column | Type | Description | Sample Value |
|---|---|---|---|
| `transaction_id` | Integer | Unique identifier per transaction | `1` |
| `date` | String (YYYY-MM-DD) | Date of transaction | `2020-10-26` |
| `customer_id` | Integer | Account holder unique ID | `926` |
| `amount` | Float | Transaction dollar value | `6478.39` |
| `type` | String | Transaction nature (`credit` / `debit`) | `credit` |
| `description` | Text | Natural language transaction narrative | `Expect series shake art again our.` |

### Risk Analytics Applied
* **Amount Z-Score:** Distance from population mean $\mu$ normalized by $\sigma$.
* **Customer Velocity Factor:** Transaction volume spikes relative to user baseline.
* **NLP Narrative Sentiment:** Detection of high-risk operational keywords in transaction descriptions.

---

## 2. Financial PhraseBank (`all-data.csv`)
* **Source:** [Kaggle: Sentiment Analysis for Financial News](https://www.kaggle.com/datasets/ankurzing/sentiment-analysis-for-financial-news) by `ankurzing`
* **Raw Size:** ~672 KB (4,846 expert-annotated financial sentences)
* **Sample Size:** 2,000 records (`data/samples/phrasebank_sample.csv`)
* **Domain:** Benchmark Financial Sentiment Corpus (Malo et al., Aalto University)

### Schema
| Column | Type | Description | Sample Value |
|---|---|---|---|
| `sentiment` | String | Financial tone (`positive`, `negative`, `neutral`) | `negative` |
| `text` | Text | Financial phrase extracted from regulatory disclosures | `The net sales of the whole fiscal year 2008 will be lower...` |

### NLP Benchmark Usage
* Calibrates domain-specific financial sentiment lexicons.
* Serves as ground truth benchmark for corporate earning statements and regulatory guidance.

---

## 3. Financial News Headlines (`cnbc_headlines.csv`, `guardian_headlines.csv`, `reuters_headlines.csv`)
* **Source:** [Kaggle: Financial News Headlines](https://www.kaggle.com/datasets/notlucasp/financial-news-headlines) by `notlucasp`
* **Raw Size:** ~11.8 MB (Reuters ~9.7MB, Guardian ~1.4MB, CNBC ~682KB)
* **Sample Size:** 2,000 records per source (6,000 total in `data/samples/`)
* **Domain:** Global Macroeconomic & Corporate Intelligence

### Schema
| Column | Type | Description |
|---|---|---|
| `Headlines` / `headline` | Text | Main breaking news title |
| `Time` / `time` | String | Publishing timestamp |
| `Description` / `description` | Text | Full article summary or lede paragraph |

### Analytical Use
* Automated polarity extraction & keyword detection (mergers, interest rates, layoffs, defaults).
* Multi-source correlation: linking news sentiment shocks directly to portfolio VaR recalculations.

---

## 4. Stock Tweet Sentiment Dataset (`reduced_dataset-release.csv`)
* **Source:** [Kaggle: Tweet Sentiment's Impact on Stock Returns](https://www.kaggle.com/datasets/thedevastator/tweet-sentiment-s-impact-on-stock-returns/data) by `thedevastator`
* **Raw Size:** ~23.3 MB (200,000+ financial tweets)
* **Sample Size:** 3,000 records (`data/samples/tweets_sample.csv`)
* **Domain:** High-Frequency Retail & Institutional Social Sentiment

### Schema
| Column | Type | Description |
|---|---|---|
| `TWEET` | Text | Cleaned raw financial tweet |
| `STOCK` | String | Associated equity ticker (e.g. Amazon, PayPal, Apple) |
| `DATE` | String | Tweet posting date |
| `LAST_PRICE` | Float | Close price of target equity |
| `1_DAY_RETURN` | Float | Forward 1-day percentage equity return |
| `7_DAY_RETURN` | Float | Forward 7-day cumulative return |
| `VOLATILITY_10D` | Float | 10-day rolling price volatility |
| `VOLATILITY_30D` | Float | 30-day rolling price volatility |
| `LSTM_POLARITY` | Integer | Precomputed deep learning polarity (-1, 0, 1) |
| `TEXTBLOB_POLARITY` | Float | Continuous sentiment score [-1.0, 1.0] |

---

## Summary Statistics
* **Total Sample Records:** ~14,000 combined records
* **SQLite Database Size:** ~3.2 MB (`data/finrisk.sqlite3`)
* **Zero Dependency on External Cloud Services:** 100% locally executable on macOS / Linux.
