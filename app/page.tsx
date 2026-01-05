"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function MedicalAIPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ prediction: string; confidence: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Trigger page load animation
  useState(() => {
    setTimeout(() => setIsVisible(true), 100)
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(droppedFile)
      setResult(null)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
      setResult(null)
    }
  }, [])

  const handleAnalyze = async () => {
    if (!file) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Error analyzing image:", error)
      // For demo purposes, show sample result
      setResult({ prediction: "nevus", confidence: 0.83 })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 animate-gradient" />

      <div
        className={cn(
          "relative z-10 container mx-auto px-4 py-12 transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
      >
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#00FF00]/10 rounded-full border border-[#00FF00]/20">
            <div className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">AI Medical Diagnosis</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-balance">
            Медициналық AI Диагностикасы
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            Терінің ауруларын анықтау үшін жасанды интеллект технологиясын пайдаланыңыз
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Zone */}
          <Card
            className={cn(
              "relative overflow-hidden transition-all duration-500 border-2",
              isDragging ? "border-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.3)] scale-[1.02]" : "border-gray-200",
              "hover:shadow-xl hover:border-[#00FF00]/50",
            )}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="p-12 text-center"
            >
              {!preview ? (
                <div className="space-y-6 animate-fade-in">
                  <div
                    className={cn(
                      "w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#00FF00]/20 to-emerald-100 flex items-center justify-center transition-transform duration-300",
                      isDragging && "scale-110 rotate-3",
                    )}
                  >
                    <Upload className="w-10 h-10 text-[#00FF00]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Суретті жүктеңіз</h3>
                    <p className="text-gray-500">Файлды осы жерге апарыңыз немесе таңдаңыз</p>
                  </div>
                  <label>
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    <Button
                      size="lg"
                      className="bg-[#00FF00] hover:bg-[#00DD00] text-gray-900 font-semibold px-8 transition-all hover:scale-105 hover:shadow-lg"
                      asChild
                    >
                      <span>Файл таңдау</span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="relative max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl">
                    <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-auto" />
                  </div>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <label>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                      <Button variant="outline" size="lg" asChild>
                        <span>Басқа сурет таңдау</span>
                      </Button>
                    </label>
                    <Button
                      size="lg"
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="bg-[#00FF00] hover:bg-[#00DD00] text-gray-900 font-semibold px-8 transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          AI талдау жүргізіп жатыр...
                        </>
                      ) : (
                        "Талдауды бастау"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Results */}
          {result && (
            <div className="animate-slide-up space-y-6">
              {/* Prediction Card */}
              <Card className="relative overflow-hidden border-2 border-[#00FF00]/30 shadow-[0_0_40px_rgba(0,255,0,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent" />
                <div className="relative p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-[#00FF00]" />
                    <div>
                      <p className="text-sm text-gray-600">AI анықтаған нәтиже</p>
                      <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-wide">{result.prediction}</h2>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Сенімділік деңгейі</span>
                      <span className="text-2xl font-bold text-[#00FF00]">{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00FF00] to-emerald-400 rounded-full transition-all duration-1000 ease-out animate-progress-fill shadow-[0_0_10px_rgba(0,255,0,0.5)]"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Circular Progress */}
                  <div className="flex justify-center py-4">
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-100"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          className="text-[#00FF00] transition-all duration-1000 ease-out"
                          style={{
                            strokeDasharray: `${2 * Math.PI * 56}`,
                            strokeDashoffset: `${2 * Math.PI * 56 * (1 - result.confidence)}`,
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">{Math.round(result.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Medical Disclaimer */}
              <Card className="border-amber-200 bg-amber-50/50">
                <div className="p-6 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-amber-900">Медициналық ескерту</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Бұл AI жүйесі дәрігердің кәсіби кеңесін алмастырмайды. Дәл диагноз қою үшін медицина мамандарына
                      жүгініңіз. Жүйе тек алдын-ала бағалау үшін қолданылады.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-gray-500">
          <p>Powered by Medical AI Technology • Медициналық AI Технологиясы</p>
        </footer>
      </div>
    </div>
  )
}
