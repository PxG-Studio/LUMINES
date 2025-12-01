# 🚀 Federated Modules Quick Start Guide

**Setting up Module Federation for WISSIL subsystems**

---

## 📋 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Kernel Package

```bash
cd packages/wissil-kernel
npm run build
```

### 3. Start Remote Modules

**Terminal 1 - Slate:**
```bash
cd packages/slate
npm run dev  # Runs on port 4311
```

**Terminal 2 - Ignis:**
```bash
cd packages/ignis
npm run dev  # Runs on port 4312
```

**Terminal 3 - Spark:**
```bash
cd packages/spark
npm run dev  # Runs on port 4313
```

### 4. Start Hub Storybook

```bash
cd apps/hub
npm run storybook  # Loads all federated modules
```

---

## 🧪 Testing Federation

In Hub Storybook, you can now import:

```typescript
// Lazy load Ignis components
const NodeRenderer = await import("ignis/NodeRenderer");

// Lazy load Slate components
const Button = await import("slate/Button");
```

---

## 📦 Building for Production

```bash
# Build all remotes
turbo run build:federation

# Build hub
cd apps/hub
npm run build-storybook
```

---

**Quick Start** ✅

*Last Updated: December 2024*

