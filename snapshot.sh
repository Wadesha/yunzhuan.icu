#!/bin/bash

timestamp=$(date +"%Y%m%d_%H%M%S")
snapshot_root="snapshots"
snapshot_dir="${snapshot_root}/snapshot_${timestamp}"

mkdir -p "${snapshot_dir}"

find . -name "*.html" -not -path "./snapshots/*" -not -path "./node_modules/*" | while read file; do
    rel_path="${file#./}"
    target_dir="${snapshot_dir}/$(dirname "${rel_path}")"
    mkdir -p "${target_dir}"
    cp "${file}" "${snapshot_dir}/${rel_path}"
done

echo "✅ 全站快照已保存: ${snapshot_dir}"
echo "📊 已备份 HTML 文件数: $(find "${snapshot_dir}" -name "*.html" | wc -l)"

git add "${snapshot_dir}"

echo "✅ 快照已添加到 git"
