"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PestAnalysisRequest, PestAnalysisResponse } from "@/types/pest-analysis"
import { Bug, Leaf, AlertTriangle, Shield, Clock, Droplets, Info } from "lucide-react"
import { pestAnalysis } from "@/adapter/pest-analysis"

export function PestAnalysisForm() {
  const [formData, setFormData] = useState<PestAnalysisRequest>({
    cropType: "",
    symptoms: ""
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PestAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cropType.trim() || !formData.symptoms.trim()) {
      setError("Vui lòng điền đầy đủ thông tin về cây trồng và triệu chứng")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await pestAnalysis(formData)
      setResult(response)
    } catch {
      setError("Có lỗi xảy ra khi phân tích. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }, [formData]);

  const handleInputChange = useCallback((field: keyof PestAnalysisRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Leaf className="w-8 h-8 text-green-600" />
          Phân tích sâu bệnh cây trồng
        </h1>
        <p className="text-gray-600">
          Nhập thông tin về cây trồng và triệu chứng để nhận được phân tích chi tiết về sâu bệnh
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Thông tin cây trồng
          </CardTitle>
          <CardDescription>
            Vui lòng cung cấp thông tin chi tiết để có kết quả phân tích chính xác nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="cropType" className="text-sm font-medium">
                Tên cây trồng *
              </label>
              <Input
                id="cropType"
                placeholder="Ví dụ: lúa, ngô, cà chua, ớt..."
                value={formData.cropType}
                onChange={(e) => handleInputChange("cropType", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="symptoms" className="text-sm font-medium">
                Mô tả triệu chứng *
              </label>
              <Textarea
                id="symptoms"
                placeholder="Mô tả chi tiết các dấu hiệu bất thường: màu sắc lá, vết đốm, sự xuất hiện của côn trùng, tình trạng cây..."
                value={formData.symptoms}
                onChange={(e) => handleInputChange("symptoms", e.target.value)}
                className="w-full min-h-[120px]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Đang phân tích...
                </div>
              ) : (
                "Phân tích sâu bệnh"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Leaf className="w-5 h-5" />
                Kết quả phân tích: {result.cropType}
              </CardTitle>
              <CardDescription>
                Triệu chứng: {result.cropSymptom}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            {result.possiblePestsOrDiseases.map((pest, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Bug className="w-5 h-5" />
                    {pest.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Nguyên nhân:</h4>
                      <p className="text-sm">{pest.cause}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Tác hại:</h4>
                      <p className="text-sm">{pest.impact}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Biện pháp xử lý
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-1">Phương pháp:</h5>
                        <p className="text-sm">{pest.treatment.method}</p>
                      </div>

                      {pest.treatment.recommendedProducts.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1">Sản phẩm khuyến nghị:</h5>
                          <div className="flex flex-wrap gap-2">
                            {pest.treatment.recommendedProducts.map((product, idx) => (
                              <span 
                                key={idx}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs"
                              >
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Thời điểm áp dụng:
                          </h5>
                          <p className="text-sm">{pest.treatment.applicationTiming}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            Liều lượng:
                          </h5>
                          <p className="text-sm">{pest.treatment.dosage}</p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                        <h5 className="font-medium text-sm text-yellow-800 mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Lưu ý an toàn:
                        </h5>
                        <p className="text-sm text-yellow-700">{pest.treatment.safetyNotes}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {result.additionalInfo && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Info className="w-5 h-5" />
                  Thông tin bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800">{result.additionalInfo}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
