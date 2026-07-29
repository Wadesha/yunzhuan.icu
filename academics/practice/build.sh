#!/bin/bash
# ================================================================
# Practice 站点打包脚本 v38
# 压缩/打包 html/css/js 为静态站点 zip
# 显示文件大小统计
# ================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DIST_DIR="$SCRIPT_DIR/dist"
ZIP_NAME="practice-site-$(date +%Y%m%d-%H%M%S).zip"

echo "============================================"
echo " Practice 站点打包脚本 v38"
echo "============================================"
echo ""

# 1. 清理并创建 dist 目录
echo "[1/5] 清理旧的构建产物..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# 2. 复制核心文件
echo "[2/5] 复制核心文件..."
cp -r "$SCRIPT_DIR"/*.html "$DIST_DIR/" 2>/dev/null || true
cp "$SCRIPT_DIR/README.md" "$DIST_DIR/" 2>/dev/null || true

# 复制子目录
for dir in sat act ap ib alevel toefl ielts igcse; do
  if [ -d "$SCRIPT_DIR/$dir" ]; then
    mkdir -p "$DIST_DIR/$dir"
    cp "$SCRIPT_DIR/$dir"/*.html "$DIST_DIR/$dir/" 2>/dev/null || true
  fi
done

# 复制 JS
if [ -d "$PROJECT_DIR/../../js" ]; then
  JS_DIR="$PROJECT_DIR/../../js"
elif [ -d "$SCRIPT_DIR/../../../js" ]; then
  JS_DIR="$SCRIPT_DIR/../../../js"
else
  JS_DIR="$PROJECT_DIR/js"
fi

mkdir -p "$DIST_DIR/js"
if [ -d "$JS_DIR" ]; then
  cp "$JS_DIR"/*.js "$DIST_DIR/js/" 2>/dev/null || true
  cp "$JS_DIR"/*.css "$DIST_DIR/js/" 2>/dev/null || true
fi

# 复制 favicon
if [ -f "$PROJECT_DIR/../../../favicon.svg" ]; then
  cp "$PROJECT_DIR/../../../favicon.svg" "$DIST_DIR/"
elif [ -f "$SCRIPT_DIR/../../favicon.svg" ]; then
  cp "$SCRIPT_DIR/../../favicon.svg" "$DIST_DIR/"
fi

# 3. 压缩 CSS/JS（如果有压缩工具）
echo "[3/5] 压缩静态资源..."

if command -v npx &> /dev/null; then
  echo "  检测到 Node.js，尝试压缩..."
  for css_file in "$DIST_DIR"/js/*.css; do
    [ -f "$css_file" ] || continue
    npx --yes css-minifier-terser "$css_file" -o "$css_file.min" 2>/dev/null && mv "$css_file.min" "$css_file" || echo "  ⚠ CSS 压缩失败: $(basename "$css_file")"
  done
  for js_file in "$DIST_DIR"/js/*.js; do
    [ -f "$js_file" ] || continue
    npx --yes terser "$js_file" -o "$js_file.min" 2>/dev/null && mv "$js_file.min" "$js_file" || echo "  ⚠ JS 压缩失败: $(basename "$js_file")"
  done
else
  echo "  ⚠ 未检测到 Node.js，跳过压缩步骤"
fi

# 4. 统计文件大小
echo "[4/5] 生成文件大小统计..."
STATS_FILE="$DIST_DIR/file-stats.txt"
echo "Practice 站点文件统计" > "$STATS_FILE"
echo "生成时间: $(date)" >> "$STATS_FILE"
echo "" >> "$STATS_FILE"

total_size=0
total_files=0

echo "--- 文件列表 ---" >> "$STATS_FILE"
find "$DIST_DIR" -type f | while read -r f; do
  size=$(stat -c%s "$f" 2>/dev/null || stat -f%z "$f" 2>/dev/null || echo 0)
  rel="${f#$DIST_DIR/}"
  echo "  $size bytes  $rel" >> "$STATS_FILE"
done

total_size=$(du -sb "$DIST_DIR" 2>/dev/null | cut -f1)
total_files=$(find "$DIST_DIR" -type f | wc -l)

echo "" >> "$STATS_FILE"
echo "--- 汇总 ---" >> "$STATS_FILE"
echo "文件总数: $total_files" >> "$STATS_FILE"
echo "总大小: $total_size bytes ($(numfmt --to=iec $total_size 2>/dev/null || echo "$total_size B"))" >> "$STATS_FILE"

echo ""
echo "[5/5] 打包为 ZIP..."
cd "$DIST_DIR"
zip -r "../$ZIP_NAME" . 2>/dev/null || tar -czf "../$ZIP_NAME.tar.gz" . 2>/dev/null

cd "$SCRIPT_DIR"
ZIP_SIZE=$(stat -c%s "$SCRIPT_DIR/$ZIP_NAME" 2>/dev/null || stat -f%z "$SCRIPT_DIR/$ZIP_NAME" 2>/dev/null || echo 0)

echo ""
echo "============================================"
echo " 构建完成！"
echo "============================================"
echo ""
echo "📦 产物目录: $DIST_DIR"
echo "🗜 ZIP 文件: $SCRIPT_DIR/$ZIP_NAME"
echo "📊 文件数: $total_files"
echo "📏 总大小: $total_size bytes"
echo "📋 统计:   $STATS_FILE"
echo ""
echo "快速预览（本地服务器）:"
echo "  cd $DIST_DIR && python3 -m http.server 8080"
echo "  然后访问 http://localhost:8080/"
echo ""