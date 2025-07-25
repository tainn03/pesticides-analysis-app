import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImplementationPlanResponse } from '@/types/pest-analysis';
import { Calendar, Clock, CheckCircle2, AlertTriangle, Wrench, Package, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ImplementationTimelineProps {
  plan: ImplementationPlanResponse;
}

export function ImplementationTimeline({ plan }: ImplementationTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStepColor = (day: number, total: number) => {
    const progress = day / total;
    if (progress <= 0.3) return 'bg-red-500';
    if (progress <= 0.6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
          <Calendar className="w-6 h-6" />
          Kế hoạch triển khai: {plan.pestName}
        </CardTitle>
        <div className="flex flex-wrap gap-4 text-sm text-blue-700 mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(plan.planStartDate)} - {formatDate(plan.planEndDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{plan.totalDuration} ngày</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{plan.steps.length} bước thực hiện</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {plan.steps.map((step) => (
            <div key={step.day} className="relative flex items-start mb-8 last:mb-0">
              {/* Timeline dot */}
              <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${getStepColor(step.day, plan.totalDuration)} flex items-center justify-center text-white font-bold shadow-lg`}>
                {step.day}
              </div>
              
              {/* Content */}
              <div className="ml-6 flex-1">
                <Card className={`border-l-4 ${step.isUrgent ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {step.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {formatDate(step.date)}
                        </Badge>
                        {step.isUrgent && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Khẩn cấp
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{step.description}</p>
                    
                    {/* Tasks */}
                    {step.tasks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Nhiệm vụ cần thực hiện:
                        </h4>
                        <ul className="space-y-1">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Materials */}
                    {step.materials.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
                          <Package className="w-4 h-4 text-blue-600" />
                          Vật tư cần chuẩn bị:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {step.materials.map((material, materialIndex) => (
                            <Badge key={materialIndex} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Notes */}
                    {step.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <h4 className="font-medium text-sm text-yellow-800 mb-1 flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Ghi chú quan trọng:
                        </h4>
                        <p className="text-sm text-yellow-700">{step.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-8 space-y-4">
          {/* General Notes */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Lưu ý chung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">{plan.generalNotes}</p>
            </CardContent>
          </Card>
          
          {/* Success Indicators */}
          {plan.successIndicators.length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Dấu hiệu thành công
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.successIndicators.map((indicator, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-700">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
