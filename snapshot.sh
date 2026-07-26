#!/bin/bash

timestamp=$(date +"%Y%m%d_%H%M%S")
snapshot_dir="snapshots"
source_file="index.html"
snapshot_file="${snapshot_dir}/index_${timestamp}.html"

mkdir -p "${snapshot_dir}"

cp "${source_file}" "${snapshot_file}"

echo "✅ 快照已保存: ${snapshot_file}"

git add "${snapshot_file}"

echo "✅ 快照已添加到 git"
