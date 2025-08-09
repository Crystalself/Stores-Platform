"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Box, IconButton, Typography, CircularProgress, Alert, Tooltip, Fab } from "@mui/material"
import { Fullscreen, FullscreenExit, RotateLeft, RotateRight, ZoomIn, ZoomOut, Refresh } from "@mui/icons-material"
import type { Mesh } from "three"

/**
 * عارض المنتجات ثلاثية الأبعاد
 * 3D Product Viewer Component
 */

interface Product3DViewerProps {
  modelUrl: string
  productName: string
  autoRotate?: boolean
  showControls?: boolean
  height?: number
}

export default function Product3DViewer({
  modelUrl,
  productName,
  autoRotate = true,
  showControls = true,
  height = 400,
}: Product3DViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const controlsRef = useRef<any>()

  // معالج وضع ملء الشاشة
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // معالج إعادة تعيين الكاميرا
  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  // معالج التدوير
  const handleRotate = (direction: "left" | "right") => {
    if (controlsRef.current) {
      const angle = direction === "left" ? -Math.PI / 4 : Math.PI / 4
      controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() + angle)
    }
  }

  // معالج التكبير
  const handleZoom = (direction: "in" | "out") => {
    if (controlsRef.current) {
      const factor = direction === "in" ? 0.8 : 1.2
      controlsRef.current.dollyIn(factor)
      controlsRef.current.update()
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: isFullscreen ? "100vh" : height,
        borderRadius: isFullscreen ? 0 : 2,
        overflow: "hidden",
        bgcolor: "grey.100",
        ...(isFullscreen && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }),
      }}
    >
      {/* Canvas ثلاثي الأبعاد */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={<LoadingFallback />}>
          <Model3D url={modelUrl} autoRotate={autoRotate} onError={setError} />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />
          <Environment preset="studio" />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.75} scale={10} blur={2.5} far={4} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
        </Suspense>
      </Canvas>

      {/* رسالة الخطأ */}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <Alert severity="error" sx={{ maxWidth: 300 }}>
            <Typography variant="body2">فشل في تحميل النموذج ثلاثي الأبعاد</Typography>
          </Alert>
        </Box>
      )}

      {/* أدوات التحكم */}
      {showControls && !error && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            bgcolor: "rgba(0, 0, 0, 0.7)",
            borderRadius: 3,
            p: 1,
          }}
        >
          <Tooltip title="تدوير يسار">
            <IconButton size="small" onClick={() => handleRotate("left")} sx={{ color: "white" }}>
              <RotateLeft />
            </IconButton>
          </Tooltip>

          <Tooltip title="تدوير يمين">
            <IconButton size="small" onClick={() => handleRotate("right")} sx={{ color: "white" }}>
              <RotateRight />
            </IconButton>
          </Tooltip>

          <Tooltip title="تكبير">
            <IconButton size="small" onClick={() => handleZoom("in")} sx={{ color: "white" }}>
              <ZoomIn />
            </IconButton>
          </Tooltip>

          <Tooltip title="تصغير">
            <IconButton size="small" onClick={() => handleZoom("out")} sx={{ color: "white" }}>
              <ZoomOut />
            </IconButton>
          </Tooltip>

          <Tooltip title="إعادة تعيين">
            <IconButton size="small" onClick={handleReset} sx={{ color: "white" }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* زر ملء الشاشة */}
      <Fab
        size="small"
        onClick={handleFullscreen}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          "&:hover": {
            bgcolor: "rgba(0, 0, 0, 0.9)",
          },
        }}
      >
        {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
      </Fab>

      {/* معلومات المنتج */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          p: 2,
          maxWidth: 200,
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {productName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          عرض ثلاثي الأبعاد تفاعلي
        </Typography>
      </Box>
    </Box>
  )
}

// مكون النموذج ثلاثي الأبعاد
function Model3D({
  url,
  autoRotate,
  onError,
}: {
  url: string
  autoRotate: boolean
  onError: (error: string) => void
}) {
  const meshRef = useRef<Mesh>(null)
  const gltf = useLoader(GLTFLoader, url)

  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return <primitive ref={meshRef} object={gltf.scene} scale={[1, 1, 1]} position={[0, 0, 0]} />
}

// مكون التحميل
function LoadingFallback() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        جاري تحميل النموذج ثلاثي الأبعاد...
      </Typography>
    </Box>
  )
}
