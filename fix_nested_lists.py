#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

with open('/workspace/upgrade_steps.py', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
fixed_lines = []
i = 0
fix_count = 0

while i < len(lines):
    line = lines[i]
    
    # 检测模式：当前行以 ' 或 " 结尾，下一行是嵌套的列表 [' 或 ["
    # 即当前行是列表元素，下一行错误地开始了一个新的嵌套列表
    stripped = line.rstrip()
    
    # 检查当前行是否是列表元素的结尾（以 ', 或 ", 或 ' 或 " 结尾）
    if (stripped.endswith("',") or stripped.endswith('",') or 
        stripped.endswith("'") or stripped.endswith('"')):
        
        # 看下一行
        if i + 1 < len(lines):
            next_line = lines[i + 1]
            next_stripped = next_line.lstrip()
            
            # 如果下一行以 [' 或 [" 开头，说明是嵌套列表，需要修复
            if next_stripped.startswith("['") or next_stripped.startswith('["'):
                # 计算当前行的缩进
                current_indent = len(line) - len(line.lstrip())
                next_indent = len(next_line) - len(next_line.lstrip())
                
                # 如果下一行的缩进 >= 当前行缩进，说明是嵌套列表
                if next_indent >= current_indent:
                    # 修复：去掉嵌套的 [ 符号
                    # 找到 [ 的位置并移除
                    bracket_pos = next_line.find('[')
                    if bracket_pos != -1:
                        fixed_next = next_line[:bracket_pos] + next_line[bracket_pos+1:]
                        fixed_lines.append(line)
                        fixed_lines.append(fixed_next)
                        fix_count += 1
                        print(f"修复第 {i+2} 行的嵌套列表")
                        i += 2
                        continue
    
    fixed_lines.append(line)
    i += 1

# 现在还需要处理对应的闭合括号问题
# 即原来的 ], 应该变成 ',
new_content = '\n'.join(fixed_lines)

# 再次检测是否还有语法错误
import ast
try:
    ast.parse(new_content)
    print(f"\n修复完成！共修复 {fix_count} 处嵌套列表问题")
    print("语法检查通过！")
    
    with open('/workspace/upgrade_steps.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("已保存修复后的文件")
except SyntaxError as e:
    print(f"\n修复了 {fix_count} 处，但仍有语法错误：")
    print(f"第 {e.lineno} 行 - {e.msg}")
    lines2 = new_content.split('\n')
    start = max(0, e.lineno - 5)
    end = min(len(lines2), e.lineno + 3)
    for j in range(start, end):
        marker = '>>>' if j == e.lineno - 1 else '   '
        print(f"{marker} {j+1}: {lines2[j]}")
    
    # 保存修复了一部分的文件
    with open('/workspace/upgrade_steps.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
