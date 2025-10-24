#!/usr/bin/env python3
import re
from pathlib import Path

ROOTS = ["pages", "components", "content", "public", "consequence-ecology", "press"]
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE = re.compile(r"\b(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})\b")

violations = []
for root in ROOTS:
  p = Path(root)
  if not p.exists():
    continue
  for fp in p.rglob("*"):
    if fp.is_dir():
      continue
    if fp.suffix.lower() in {".png", ".jpg", ".jpeg", ".pdf", ".zip", ".docx", ".ico", ".svg"}:
      continue
    try:
      text = fp.read_text(encoding="utf-8", errors="ignore")
    except Exception:
      continue
    if EMAIL.search(text) or PHONE.search(text):
      violations.append(str(fp))

if violations:
  print("[PUBLIC LINT] Potential PII found in:")
  for v in violations:
    print(" -", v)
  raise SystemExit(4)
else:
  print("public_lint: OK")
