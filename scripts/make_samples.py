#!/usr/bin/env python3
"""Generate small sample CSVs from raw datasets for repo inclusion."""
import os, csv, random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW  = os.path.expanduser("~/Desktop/dataset_11")
OUT  = os.path.join(ROOT, "data", "samples")
os.makedirs(OUT, exist_ok=True)

def sample_csv(src, dst, n=2000, has_header=True):
    with open(src, "r", encoding="utf-8", errors="replace") as f:
        reader = csv.reader(f)
        if has_header:
            header = next(reader)
        rows = list(reader)
    random.seed(42)
    sampled = random.sample(rows, min(n, len(rows)))
    with open(dst, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if has_header:
            writer.writerow(header)
        writer.writerows(sampled)
    print(f"  {os.path.basename(dst)}: {len(sampled)} rows")

def sample_phrasebank(src, dst, n=2000):
    """PhraseBank has no real header - format is 'text@sentiment'."""
    with open(src, "r", encoding="latin-1", errors="replace") as f:
        lines = f.readlines()
    random.seed(42)
    sampled = random.sample(lines, min(n, len(lines)))
    with open(dst, "w", encoding="utf-8") as f:
        f.write("sentiment,text\n")
        for line in sampled:
            line = line.strip()
            if not line:
                continue
            # Try splitting by last @ sign (PhraseBank format)
            if "@" in line:
                idx = line.rfind("@")
                text = line[:idx].strip()
                sentiment = line[idx+1:].strip()
            else:
                # Fallback: first field is sentiment
                parts = line.split(",", 1)
                if len(parts) == 2:
                    sentiment = parts[0].strip()
                    text = parts[1].strip()
                else:
                    sentiment = "neutral"
                    text = line
            # Escape text for CSV
            text = text.replace('"', '""')
            f.write(f'{sentiment},"{text}"\n')
    print(f"  {os.path.basename(dst)}: {len(sampled)} rows")

print("=== Generating samples ===")

# 1. Financial Transactions
sample_csv(
    os.path.join(RAW, "financial_transactions.csv"),
    os.path.join(OUT, "transactions_sample.csv"),
    n=3000
)

# 2. Tweet Sentiment (reduced)
sample_csv(
    os.path.join(RAW, "archive (1)", "reduced_dataset-release.csv"),
    os.path.join(OUT, "tweets_sample.csv"),
    n=3000
)

# 3. Financial PhraseBank
sample_phrasebank(
    os.path.join(RAW, "archive", "all-data.csv"),
    os.path.join(OUT, "phrasebank_sample.csv"),
    n=2000
)

# 4. Headlines (CNBC)
sample_csv(
    os.path.join(RAW, "archive 3 ", "cnbc_headlines.csv"),
    os.path.join(OUT, "cnbc_headlines_sample.csv"),
    n=2000
)

# 5. Headlines (Guardian)
sample_csv(
    os.path.join(RAW, "archive 3 ", "guardian_headlines.csv"),
    os.path.join(OUT, "guardian_headlines_sample.csv"),
    n=2000
)

# 6. Headlines (Reuters)
sample_csv(
    os.path.join(RAW, "archive 3 ", "reuters_headlines.csv"),
    os.path.join(OUT, "reuters_headlines_sample.csv"),
    n=2000
)

print("=== Done! Samples in data/samples/ ===")
