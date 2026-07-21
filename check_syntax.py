#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import ast

with open('/workspace/upgrade_steps.py', 'r', encoding='utf-8') as f:
    source = f.read()

try:
    ast.parse(source)
    print("语法正确！")
except SyntaxError as e:
    print(f"语法错误：第{e.lineno}行 - {e.msg}")
    lines = source.split('\n')
    start = max(0, e.lineno - 5)
    end = min(len(lines), e.lineno + 3)
    for i in range(start, end):
        marker = '>>>' if i == e.lineno - 1 else '   '
        print(f"{marker} {i+1}: {lines[i]}")
