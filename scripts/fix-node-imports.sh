#!/bin/bash
# 修复 next-on-pages 生成的 Edge Function 里的 Node.js 模块导入问题
# Cloudflare Workers 里 Node.js 内置模块需要用 node: 前缀

FUNC_DIR=".vercel/output/static/_worker.js/__next-on-pages-dist__/functions"

if [ ! -d "$FUNC_DIR" ]; then
  echo "Error: $FUNC_DIR not found"
  exit 1
fi

echo "Fixing Node.js module imports in Edge Functions..."

# 查找所有 func.js 文件
find "$FUNC_DIR" -name "*.func.js" | while read -r file; do
  echo "  Processing: $file"
  
  # 修复 async_hooks
  sed -i '' 's/from"async_hooks"/from"node:async_hooks"/g' "$file"
  
  # 修复其他可能的 Node.js 模块
  sed -i '' 's/from"buffer"/from"node:buffer"/g' "$file"
  sed -i '' 's/from"events"/from"node:events"/g' "$file"
  sed -i '' 's/from"util"/from"node:util"/g' "$file"
  sed -i '' 's/from"stream"/from"node:stream"/g' "$file"
  sed -i '' 's/from"path"/from"node:path"/g' "$file"
  sed -i '' 's/from"fs"/from"node:fs"/g' "$file"
  sed -i '' 's/from"crypto"/from"node:crypto"/g' "$file"
  sed -i '' 's/from"url"/from"node:url"/g' "$file"
  sed -i '' 's/from"querystring"/from"node:querystring"/g' "$file"
  sed -i '' 's/from"string_decoder"/from"node:string_decoder"/g' "$file"
done

echo "Done! All Node.js module imports have been fixed."
