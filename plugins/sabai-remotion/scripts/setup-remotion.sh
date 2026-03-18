#!/bin/bash
# setup-remotion.sh — Initialize a Remotion project for video rendering
# Idempotent: skips setup if already done this session

set -euo pipefail

PROJECT_DIR="/tmp/remotion-project"

# Check if already set up
if [ -d "${PROJECT_DIR}/node_modules/@remotion/cli" ]; then
  echo "Remotion project already set up at ${PROJECT_DIR}" >&2
  exit 0
fi

echo "Setting up Remotion project..." >&2

# Create project directory
mkdir -p "${PROJECT_DIR}/src"

# Create package.json
cat > "${PROJECT_DIR}/package.json" << 'PKGJSON'
{
  "name": "remotion-video",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@remotion/cli": "4.0.291",
    "@remotion/bundler": "4.0.291",
    "react": "^19",
    "react-dom": "^19",
    "remotion": "4.0.291",
    "typescript": "^5"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
PKGJSON

# Create tsconfig
cat > "${PROJECT_DIR}/tsconfig.json" << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
TSCONFIG

# Create remotion.config.ts
cat > "${PROJECT_DIR}/remotion.config.ts" << 'RMCONFIG'
import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("png");
RMCONFIG

# Create default entry point
cat > "${PROJECT_DIR}/src/index.ts" << 'INDEX'
import { registerRoot } from "remotion";
import { Root } from "./Root";
registerRoot(Root);
INDEX

# Create default Root component
cat > "${PROJECT_DIR}/src/Root.tsx" << 'ROOT'
import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";

export const Root: React.FC = () => {
  return (
    <Composition
      id="main"
      component={Video}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
ROOT

# Create placeholder Video component
cat > "${PROJECT_DIR}/src/Video.tsx" << 'VIDEO'
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ opacity, fontSize: 64, color: "white", fontWeight: "bold" }}>
        Hello, Remotion!
      </div>
    </AbsoluteFill>
  );
};
VIDEO

# Install dependencies
echo "Installing dependencies (this may take a minute)..." >&2
cd "${PROJECT_DIR}"
npm install --prefer-offline 2>&1 | tail -5 >&2

echo "Remotion project ready at ${PROJECT_DIR}" >&2
