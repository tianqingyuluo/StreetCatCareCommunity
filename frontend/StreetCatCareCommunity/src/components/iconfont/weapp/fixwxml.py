import os

def fix_wxml_colors(file_path):
    # 检查文件是否存在
    if not os.path.exists(file_path):
        print(f"❌ 错误: 找不到文件 {file_path}")
        print("请确保脚本和 .wxml 文件在同一个目录下，或者修改脚本中的文件名。")
        return

    print(f"📂 正在读取 {file_path} ...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 统计原始出现的次数，方便确认是否有匹配到
        count_stroke = content.count("stroke%3D'currentColor'")
        count_fill = content.count("fill%3D'currentColor'")
        total_found = count_stroke + count_fill

        if total_found == 0:
            print("⚠️ 未发现 'currentColor' 字符串，可能是格式不匹配或已经替换过了。")
            return

        # --- 核心替换逻辑 ---
        # 针对 URL 编码后的格式 (%3D 是 =)
        new_content = content.replace("stroke%3D'currentColor'", "stroke%3D'{{colors}}'")
        new_content = new_content.replace("fill%3D'currentColor'", "fill%3D'{{colors}}'")
        
        # 针对可能未编码的格式 (防备万一)
        new_content = new_content.replace('stroke="currentColor"', 'stroke="{{colors}}"')
        new_content = new_content.replace("stroke='currentColor'", "stroke='{{colors}}'")

        # --- 保存文件 ---
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print("-" * 30)
        print(f"✅ 成功替换！")
        print(f"   - 修复 stroke 属性: {count_stroke} 处")
        print(f"   - 修复 fill 属性:   {count_fill} 处")
        print(f"📄 文件已保存覆盖。现在去微信开发者工具看看图标颜色吧！")
        print("-" * 30)

    except Exception as e:
        print(f"❌ 发生异常: {str(e)}")

if __name__ == "__main__":
    # 这里修改成你实际的 wxml 文件名
    target_file = "weapp.wxml" 
    fix_wxml_colors(target_file)