#!/usr/bin/env python3
import subprocess
import os
import re
from datetime import datetime, timezone

def run_cmd(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, text=True).strip()
    except:
        return ""

def get_version():
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    count = run_cmd("git rev-list --count HEAD")
    return f"v{today}-{count}"

def get_commit():
    return run_cmd("git rev-parse --short HEAD")

def get_full_commit():
    return run_cmd("git rev-parse HEAD")

def get_build_time():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def update_file(filepath, old_version, new_version, old_commit, new_commit, build_time):
    if not os.path.exists(filepath):
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changes = 0
    
    content = re.sub(r"v\d{8}-\d+", new_version, content)
    if old_commit:
        content = content.replace(old_commit, new_commit)
    
    if filepath.endswith('.js'):
        content = re.sub(r"commit:\s*['\"][0-9a-f]{7}['\"]", f"commit: '{new_commit}'", content)
        content = re.sub(r"commitFull:\s*['\"][0-9a-f]{40}['\"]", f"commitFull: '{get_full_commit()}'", content)
        content = re.sub(r"buildTime:\s*['\"][^\"]+['\"]", f"buildTime: '{build_time}'", content)
    
    if filepath.endswith('.html'):
        content = re.sub(r"var EXPECTED_COMMIT\s*=\s*['\"][0-9a-f]{7}['\"]", f"var EXPECTED_COMMIT = '{new_commit}'", content)
        content = re.sub(r"var EXPECTED_VERSION\s*=\s*['\"]v\d{8}-\d+['\"]", f"var EXPECTED_VERSION = '{new_version}'", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    old_version = run_cmd("git log --oneline -1 --grep='v' | grep -o 'v\\d\\{8\\}-\\d\\+' || echo ''")
    new_version = get_version()
    old_commit = run_cmd("git log --oneline -1 | cut -d' ' -f1")
    new_commit = get_commit()
    build_time = get_build_time()
    
    print(f"=== 版本号自动注入 ===")
    print(f"旧版本: {old_version or '未知'}")
    print(f"新版本: {new_version}")
    print(f"旧Commit: {old_commit}")
    print(f"新Commit: {new_commit}")
    print(f"构建时间: {build_time}")
    print()
    
    files = []
    for root, dirs, filenames in os.walk('prerequisite'):
        for f in filenames:
            if f.endswith('.html') or f.endswith('.js'):
                files.append(os.path.join(root, f))
    
    updated = []
    skipped = []
    for filepath in files:
        if update_file(filepath, old_version, new_version, old_commit, new_commit, build_time):
            updated.append(filepath)
        else:
            skipped.append(filepath)
    
    print(f"更新了 {len(updated)} 个文件:")
    for f in updated:
        print(f"  ✓ {f}")
    
    if skipped:
        print(f"\n跳过了 {len(skipped)} 个文件:")
        for f in skipped:
            print(f"  ✗ {f}")
    
    print(f"\n=== 完成 ===")
    print(f"版本号: {new_version}")
    print(f"Commit: {new_commit}")

if __name__ == '__main__':
    main()