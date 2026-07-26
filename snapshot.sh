#!/bin/bash

VERSION=""
if [ -n "$1" ]; then
    VERSION="$1"
fi

timestamp=$(date +"%Y%m%d_%H%M%S")
snapshot_root="snapshots"

if [ -n "$VERSION" ]; then
    snapshot_dir="${snapshot_root}/snapshot_${VERSION}"
else
    snapshot_dir="${snapshot_root}/snapshot_${timestamp}"
fi

mkdir -p "${snapshot_dir}"

find . -name "*.html" -not -path "./snapshots/*" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
    rel_path="${file#./}"
    target_dir="${snapshot_dir}/$(dirname "${rel_path}")"
    mkdir -p "${target_dir}"
    cp "${file}" "${snapshot_dir}/${rel_path}"
done

file_count=$(find "${snapshot_dir}" -name "*.html" | wc -l)

echo "✅ 全站快照已保存: ${snapshot_dir}"
echo "📊 已备份 HTML 文件数: ${file_count}"

if [ -n "$VERSION" ]; then
    echo "🏷️  版本: ${VERSION}"
fi

git add "${snapshot_dir}"

echo "✅ 快照已添加到 git"
echo ""
echo "用法:"
echo "  ./snapshot.sh              # 按时间戳命名"
echo "  ./snapshot.sh v13.2.0      # 按版本号命名"
