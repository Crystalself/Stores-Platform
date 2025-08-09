"use client"

import type React from "react"
import { useState, useRef, Suspense } from "react"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  useTheme,
} from "@mui/material"
import {
  ThreeDRotation,
  CloudUpload,
  Visibility,
  Edit,
  Delete,
  Add,
  Save,
  Cancel,
  Info,
  ViewInAr,
  Settings,
  Fullscreen,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html } from "@react-three/drei"

// Mock 3D Model Component
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1} />
}

// 3D Viewer Component
function ThreeDViewer({ modelUrl, hotspots = [] }: { modelUrl?: string; hotspots?: any[] }) {
  if (!modelUrl) {
    return (
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          borderRadius: 2,
          border: "2px dashed",
          borderColor: "grey.300",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <ThreeDRotation sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            لا يوجد نموذج ثلاثي الأبعاد
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ارفع ملف GLB أو GLTF لمعاينة النموذج
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ height: 400, borderRadius: 2, overflow: "hidden", border: 1, borderColor: "divider" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={<Html center>Loading...</Html>}>
          <Model url={modelUrl} />
          {hotspots.map((hotspot, index) => (
            <Html key={index} position={hotspot.position}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  border: "2px solid white",
                  cursor: "pointer",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.2)" },
                    "100%": { transform: "scale(1)" },
                  },
                }}
                title={hotspot.title}
              />
            </Html>
          ))}
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </Box>
  )
}

const ThreeDProducts: React.FC = () => {
  const t = useTranslations("seller")
  const theme = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: [] as string[],
    modelFile: null as File | null,
    modelUrl: "",
    hotspots: [] as any[],
  })

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [hotspotDialog, setHotspotDialog] = useState(false)
  const [newHotspot, setNewHotspot] = useState({
    title: "",
    description: "",
    position: [0, 0, 0],
  })

  const [existingProducts] = useState([
    {
      id: 1,
      name: "كرسي مكتب ثلاثي الأبعاد",
      category: "أثاث",
      status: "published",
      views: 1250,
      modelUrl: "/models/chair.glb",
    },
    {
      id: 2,
      name: "لابتوب جيمنج",
      category: "إلكترونيات",
      status: "draft",
      views: 0,
      modelUrl: "/models/laptop.glb",
    },
  ])

  const categories = ["إلكترونيات", "أثاث", "ملابس", "أحذية", "اكسسوارات", "رياضة", "كتب", "ألعاب"]

  const handleInputChange = (field: string) => (event: any) => {
    setProductData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = [".glb", ".gltf"]
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

      if (!validTypes.includes(fileExtension)) {
        alert("يرجى رفع ملف بصيغة GLB أو GLTF فقط")
        return
      }

      setProductData((prev) => ({
        ...prev,
        modelFile: file,
      }))

      // Simulate upload progress
      setIsUploading(true)
      setUploadProgress(0)

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            // Create object URL for preview
            setProductData((prevData) => ({
              ...prevData,
              modelUrl: URL.createObjectURL(file),
            }))
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const handleAddHotspot = () => {
    setProductData((prev) => ({
      ...prev,
      hotspots: [...prev.hotspots, { ...newHotspot, id: Date.now() }],
    }))
    setNewHotspot({ title: "", description: "", position: [0, 0, 0] })
    setHotspotDialog(false)
  }

  const handleSaveProduct = () => {
    // TODO: ربط مع الباك إند لحفظ المنتج ثلاثي الأبعاد
    console.log("Saving 3D product:", productData)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          المنتجات ثلاثية الأبعاد
        </Typography>
        <Typography variant="body1" color="text.secondary">
          أضف منتجات تفاعلية ثلاثية الأبعاد لتحسين تجربة العملاء
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 3D Model Upload & Preview */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                رفع النموذج ثلاثي الأبعاد
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>الصيغ المدعومة:</strong> GLB, GLTF
                  <br />
                  <strong>الحد الأقصى للحجم:</strong> 50 ميجابايت
                  <br />
                  <strong>نصيحة:</strong> استخدم نماذج محسنة للويب لضمان سرعة التحميل
                </Typography>
              </Alert>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".glb,.gltf"
                style={{ display: "none" }}
              />

              <Button
                variant="outlined"
                size="large"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
                fullWidth
                sx={{ mb: 3, py: 2 }}
                disabled={isUploading}
              >
                {isUploading ? "جاري الرفع..." : "رفع نموذج ثلاثي الأبعاد"}
              </Button>

              {isUploading && (
                <Box sx={{ mb: 3 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {uploadProgress}% مكتمل
                  </Typography>
                </Box>
              )}

              {productData.modelFile && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2">تم رفع الملف بنجاح: {productData.modelFile.name}</Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* 3D Viewer */}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  معاينة النموذج ثلاثي الأبعاد
                </Typography>
                <Box>
                  <IconButton>
                    <Settings />
                  </IconButton>
                  <IconButton>
                    <Fullscreen />
                  </IconButton>
                </Box>
              </Box>

              <ThreeDViewer modelUrl={productData.modelUrl} hotspots={productData.hotspots} />

              {productData.modelUrl && (
                <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button variant="outlined" startIcon={<Add />} onClick={() => setHotspotDialog(true)}>
                    إضافة نقطة تفاعلية
                  </Button>
                  <Button variant="outlined" startIcon={<ViewInAr />}>
                    معاينة AR
                  </Button>
                  <Button variant="outlined" startIcon={<Settings />}>
                    إعدادات العرض
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Product Information Form */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                معلومات المنتج
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="اسم المنتج"
                    value={productData.name}
                    onChange={handleInputChange("name")}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="وصف المنتج"
                    value={productData.description}
                    onChange={handleInputChange("description")}
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="السعر (ر.س)"
                    value={productData.price}
                    onChange={handleInputChange("price")}
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>الفئة</InputLabel>
                    <Select value={productData.category} onChange={handleInputChange("category")} label="الفئة">
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="الكلمات المفتاحية (مفصولة بفاصلة)"
                    variant="outlined"
                    placeholder="مثال: أثاث, مكتب, كرسي"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveProduct}
                  fullWidth
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  }}
                >
                  حفظ المنتج
                </Button>
                <Button variant="outlined" startIcon={<Cancel />} fullWidth>
                  إلغاء
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Hotspots List */}
          {productData.hotspots.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  النقاط التفاعلية
                </Typography>
                <List dense>
                  {productData.hotspots.map((hotspot, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText primary={hotspot.title} secondary={hotspot.description} />
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small">
                        <Delete />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Existing 3D Products */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                المنتجات ثلاثية الأبعاد الموجودة
              </Typography>

              <Grid container spacing={3}>
                {existingProducts.map((product) => (
                  <Grid item xs={12} md={6} lg={4} key={product.id}>
                    <Card
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        "&:hover": {
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      <Box sx={{ height: 200, bgcolor: "grey.100", position: "relative" }}>
                        <ThreeDViewer modelUrl={product.modelUrl} />
                        <Chip
                          label={product.status === "published" ? "منشور" : "مسودة"}
                          color={product.status === "published" ? "success" : "default"}
                          size="small"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        />
                      </Box>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {product.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.views} مشاهدة
                        </Typography>
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Button size="small" startIcon={<Visibility />}>
                            معاينة
                          </Button>
                          <Button size="small" startIcon={<Edit />}>
                            تعديل
                          </Button>
                          <IconButton size="small">
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Hotspot Dialog */}
      <Dialog open={hotspotDialog} onClose={() => setHotspotDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إضافة نقطة تفاعلية</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="عنوان النقطة"
                value={newHotspot.title}
                onChange={(e) => setNewHotspot((prev) => ({ ...prev, title: e.target.value }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="وصف النقطة"
                value={newHotspot.description}
                onChange={(e) =>
                  setNewHotspot((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="X"
                type="number"
                value={newHotspot.position[0]}
                onChange={(e) =>
                  setNewHotspot((prev) => ({
                    ...prev,
                    position: [Number.parseFloat(e.target.value), prev.position[1], prev.position[2]],
                  }))
                }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Y"
                type="number"
                value={newHotspot.position[1]}
                onChange={(e) =>
                  setNewHotspot((prev) => ({
                    ...prev,
                    position: [prev.position[0], Number.parseFloat(e.target.value), prev.position[2]],
                  }))
                }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Z"
                type="number"
                value={newHotspot.position[2]}
                onChange={(e) =>
                  setNewHotspot((prev) => ({
                    ...prev,
                    position: [prev.position[0], prev.position[1], Number.parseFloat(e.target.value)],
                  }))
                }
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHotspotDialog(false)}>إلغاء</Button>
          <Button onClick={handleAddHotspot} variant="contained">
            إضافة
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ThreeDProducts
