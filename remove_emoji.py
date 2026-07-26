import os
import re

BASE_DIR = '/workspace/prerequisite'

# 定义emoji替换规则
emoji_replacements = {
    '📋': '',  # 直接删除emoji标记
    '💻': '',
    '🎉': '',
    '😅': '',
    '🔥': '',
    '🎮': '',
}

# 需要保留文字的地方：页面标题中💻计算机课程刷题 -> 计算机课程刷题
# 页面按钮🎮开始刷题 -> 开始刷题
# 反馈中🎉答对了 -> 答对了 / 😅答错了 -> 答错了
# 连击🔥 -> 火焰
text_replacements = {
    '📋 ': '',  # 示例标记直接删除，保留后面的"示例："文字
    '💻 ': '',
    '🎉 ': '',
    '😅 ': '',
    '🔥 ': '',
    '🎮 ': '',
}

def remove_emojis(text):
    # 先替换带空格的
    for old, new in text_replacements.items():
        text = text.replace(old, new)
    # 再替换不带空格的
    for old, new in emoji_replacements.items():
        text = text.replace(old, new)
    return text

# 遍历所有HTML文件
count = 0
for root, dirs, files in os.walk(BASE_DIR):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            new_content = remove_emojis(content)
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                count += 1
                print(f'  Fixed: {os.path.relpath(path, BASE_DIR)}')

print(f'\n共修复 {count} 个文件中的emoji')

# 验证
print('\n=== 再次检测 ===')
found = False
for root, dirs, files in os.walk(BASE_DIR):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            for emoji in emoji_replacements.keys():
                if emoji in content:
                    print(f'  [残留] {os.path.relpath(path, BASE_DIR)}: {emoji}')
                    found = True

if not found:
    print('所有emoji已清除！')
