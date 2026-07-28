#!/bin/bash

# ============================================================================
# LOANEXA USA - AUTOMATED DEPENDENCY INSTALLATION ENGINE
# Target Platform: Node.js / Next.js 14+ Compilation Matrix
# ============================================================================

echo "📦 Initializing dependency verification registry..."

# Safety check: Ensure npm environment variable pointer is live
if ! command -v npm &> /dev/null
then
    echo "❌ CRITICAL ERROR: 'npm' execution engine could not be mapped in this terminal session."
    echo "👉 Action required: Close this window, open a fresh Git Bash terminal, and try again."
    exit 1
fi

echo "🚀 Connection verified. Commencing installation sequence..."
echo "-----------------------------------------------------------------------"

# 1. Core Production Layer Execution
echo "⚡ Phase 1/2: Pulling Core Runtime Engines..."
echo "   [next, react, react-dom, pg, lucide-react]"
npm install next react react-dom pg lucide-react

if [ $? -ne 0 ]; then
    echo "❌ Error encountered during production layer pull. Aborting installation."
    exit 1
fi

echo "-----------------------------------------------------------------------"

# 2. Static Typing & Style Pipeline Compilation Layer
echo "🛠️ Phase 2/2: Pulling Development Compiler & Styling Components..."
echo "   [typescript, @types, tailwindcss, postcss, autoprefixer]"
npm install -D typescript @types/node @types/react @types/react-dom @types/pg tailwindcss postcss autoprefixer

if [ $? -ne 0 ]; then
    echo "❌ Error encountered during development type definition pull."
    exit 1
fi

echo "-----------------------------------------------------------------------"
echo "🎉 SUCCESS: All infrastructure dependencies successfully written to node_modules!"
echo "👉 You can now run the setup scaffolding script or boot the local cluster with: npm run dev"