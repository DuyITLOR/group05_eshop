#!/usr/bin/env bash
# Dong goi bai nop Mini Exercise - API Testing (MSSV 23127178)
# Chay: bash make-zip.sh
set -euo pipefail
cd "$(dirname "$0")"

ZIP="23127178_Mini_API_Testing.zip"

REQUIRED=(
  test-design.md
  mini-apply-coupon.data.json
  mini-apply-coupon.postman_collection.json
  mini-local.postman_environment.json
  mini-newman-report.json
  newman-api-test.yml
  ci-pass.png
  ci-fail.png
)
EXTRA=(newman-cli-output.txt ci-pass-newman-log.txt ci-fail-newman-log.txt)

missing=()
for f in "${REQUIRED[@]}"; do
  [ -f "$f" ] || missing+=("$f")
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "!! Thieu ${#missing[@]} tep bat buoc:"
  printf '   - %s\n' "${missing[@]}"
  echo "   -> ci-pass.png / ci-fail.png phai chup tu tab Actions tren GitHub sau khi push."
  echo "   Van tiep tuc dong goi nhung tep dang co..."
fi

rm -f "$ZIP"
files=()
for f in "${REQUIRED[@]}" "${EXTRA[@]}"; do
  [ -f "$f" ] && files+=("$f")
done

zip -q "$ZIP" "${files[@]}"
echo "== Da tao $ZIP =="
unzip -l "$ZIP"
