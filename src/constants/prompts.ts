import { Treatment } from "@/types/pest-analysis";

export function getTextAiPrompt(symptoms: string, cropType: string) {
    return {
        "contents": [
            {
                "parts": [
                    {
                        "text": `Dựa trên mô tả dấu hiệu bất thường của cây trồng '${symptoms}' trên cây '${cropType}', đề xuất danh sách các loại sâu bệnh và bệnh lý cây trồng có thể xảy ra. Mỗi sâu bệnh hoặc bệnh lý phải bao gồm đầy đủ: tên, nguyên nhân, hậu quả, biện pháp xử lý, loại thuốc trừ sâu hoặc phân bón phù hợp, thời điểm áp dụng, liều lượng, lưu ý an toàn, và xác suất khả năng mắc bệnh (probability, giá trị từ 0 đến 1, càng cao càng có khả năng, đảm bảo tổng xác suất tất cả bệnh = 1). Đảm bảo tất cả các thuộc tính được khai báo trong schema (cropType, cropSymptom, possiblePestsOrDiseases, additionalInfo, và các thuộc tính con của possiblePestsOrDiseases bao gồm name, cause, impact, treatment, method, recommendedProducts, applicationTiming, dosage, safetyNotes, probability) đều được điền đầy đủ, không được bỏ qua bất kỳ thuộc tính nào, kể cả khi thông tin rỗng (sử dụng giá trị mặc định như 'Không có thông tin', 0 cho probability, hoặc mảng rỗng [] nếu không áp dụng). Sử dụng các từ khóa như 'sâu bệnh', 'bệnh lý cây trồng', 'thuốc trừ sâu', 'phân bón', 'dấu hiệu bất thường', 'nguyên nhân', 'hậu quả' để hỗ trợ tìm kiếm trong cơ sở dữ liệu. Cung cấp thêm thông tin bổ sung như biện pháp phòng ngừa, điều kiện môi trường liên quan, hoặc mẹo canh tác để tối ưu hóa hiệu quả. Danh sách các bệnh phải được sắp xếp theo thứ tự xác suất (probability) giảm dần.`
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "OBJECT",
                "properties": {
                    "cropType": {
                        "type": "STRING",
                        "description": "Tên cây trồng được mô tả (ví dụ: lúa, ngô, cà chua). Bắt buộc điền."
                    },
                    "cropSymptom": {
                        "type": "STRING",
                        "description": "Mô tả dấu hiệu bất thường của cây trồng (ví dụ: lá vàng, đốm nâu, héo rũ, côn trùng xuất hiện). Bắt buộc điền."
                    },
                    "possiblePestsOrDiseases": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "name": {
                                    "type": "STRING",
                                    "description": "Tên sâu bệnh hoặc bệnh lý cây trồng (ví dụ: sâu đục thân, bệnh đốm lá). Bắt buộc điền."
                                },
                                "cause": {
                                    "type": "STRING",
                                    "description": "Nguyên nhân gây ra sâu bệnh hoặc bệnh lý (ví dụ: nấm, vi khuẩn, côn trùng, thiếu dinh dưỡng). Bắt buộc điền, sử dụng 'Không xác định' nếu không có thông tin."
                                },
                                "impact": {
                                    "type": "STRING",
                                    "description": "Hậu quả của sâu bệnh hoặc bệnh lý đối với cây trồng (ví dụ: giảm năng suất, cây chết). Bắt buộc điền, sử dụng 'Không xác định' nếu không có thông tin."
                                },
                                "treatment": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "method": {
                                            "type": "STRING",
                                            "description": "Biện pháp xử lý cụ thể (ví dụ: phun thuốc trừ sâu, cải tạo đất, tỉa lá). Bắt buộc điền, sử dụng 'Không có biện pháp' nếu không áp dụng."
                                        },
                                        "recommendedProducts": {
                                            "type": "ARRAY",
                                            "items": {
                                                "type": "STRING",
                                                "description": "Tên thuốc trừ sâu hoặc phân bón phù hợp (ví dụ: Actara, NPK 20-20-15). Bắt buộc điền, trả về mảng rỗng [] nếu không có sản phẩm."
                                            }
                                        },
                                        "applicationTiming": {
                                            "type": "STRING",
                                            "description": "Thời điểm áp dụng biện pháp (ví dụ: sáng sớm, sau mưa, trước khi ra hoa). Bắt buộc điền, sử dụng 'Không xác định' nếu không có thông tin."
                                        },
                                        "dosage": {
                                            "type": "STRING",
                                            "description": "Liều lượng sử dụng (ví dụ: 10ml thuốc/lít nước, 50g phân bón/cây). Bắt buộc điền, sử dụng 'Không xác định' nếu không có thông tin."
                                        },
                                        "safetyNotes": {
                                            "type": "STRING",
                                            "description": "Lưu ý an toàn khi sử dụng thuốc hoặc phân bón (ví dụ: mang khẩu trang, tránh phun gần nguồn nước). Bắt buộc điền, sử dụng 'Không có lưu ý' nếu không áp dụng."
                                        }
                                    },
                                    "required": [
                                        "method",
                                        "recommendedProducts",
                                        "applicationTiming",
                                        "dosage",
                                        "safetyNotes"
                                    ]
                                },
                                "probability": {
                                    "type": "NUMBER",
                                    "description": "Xác suất khả năng mắc bệnh này (giá trị từ 0 đến 1, càng cao càng có khả năng). Bắt buộc điền, sử dụng 0 nếu không xác định."
                                }
                            },
                            "required": [
                                "name",
                                "cause",
                                "impact",
                                "treatment",
                                "probability"
                            ]
                        }
                    },
                    "additionalInfo": {
                        "type": "STRING",
                        "description": "Thông tin bổ sung về phòng ngừa sâu bệnh, điều kiện môi trường ảnh hưởng (như độ ẩm, nhiệt độ), hoặc mẹo canh tác để giảm nguy cơ tái phát. Bắt buộc điền, sử dụng 'Không có thông tin' nếu không có dữ liệu."
                    }
                },
                "required": [
                    "cropType",
                    "cropSymptom",
                    "possiblePestsOrDiseases",
                    "additionalInfo"
                ],
                "propertyOrdering": [
                    "cropType",
                    "cropSymptom",
                    "possiblePestsOrDiseases",
                    "additionalInfo"
                ]
            }
        }
    }
};

export function getImageAiPrompt(cropType: string) {
    return `Dựa trên hình ảnh cây trồng và loại cây '${cropType}', thực hiện phân tích để nhận diện các dấu hiệu bất thường và đề xuất danh sách các loại sâu bệnh hoặc bệnh lý cây trồng có thể xảy ra. Nếu hình ảnh không có liên quan hoặc không phải loại cây '${cropType}', hãy phản hồi rằng "Hình ảnh được cung cấp không hợp lệ".`
};

export function getInValidResponse(cropType: string, content: string) {
    return {
        cropType: cropType,
        cropSymptom: content,
        possiblePestsOrDiseases: [],
        additionalInfo: 'Không có thông tin'
    };
}

export function getImplementationPlanPrompt(pestName: string, cropType: string, treatment: Treatment, currentDate: string) {
    return {
        "contents": [
            {
                "parts": [
                    {
                        "text": `Dựa trên thông tin về sâu bệnh '${pestName}' trên cây '${cropType}' và biện pháp xử lý đã được đề xuất, hãy tạo một kế hoạch triển khai chi tiết theo từng ngày. Ngày hiện tại là ${currentDate}. 

Thông tin biện pháp xử lý:
- Phương pháp: ${treatment.method}
- Sản phẩm khuyến nghị: ${treatment.recommendedProducts.join(', ')}
- Thời điểm áp dụng: ${treatment.applicationTiming}
- Liều lượng: ${treatment.dosage}
- Lưu ý an toàn: ${treatment.safetyNotes}

Hãy tạo một kế hoạch thực hiện chi tiết từ ngày ${currentDate}, bao gồm các bước chuẩn bị, triển khai, theo dõi và đánh giá hiệu quả. Mỗi bước phải có ngày cụ thể, mô tả công việc, danh sách vật tư cần thiết và ghi chú quan trọng.`
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "OBJECT",
                "properties": {
                    "cropType": {
                        "type": "STRING",
                        "description": "Tên cây trồng. Bắt buộc điền."
                    },
                    "pestName": {
                        "type": "STRING",
                        "description": "Tên sâu bệnh cần xử lý. Bắt buộc điền."
                    },
                    "planStartDate": {
                        "type": "STRING",
                        "description": "Ngày bắt đầu kế hoạch (định dạng YYYY-MM-DD). Bắt buộc điền."
                    },
                    "planEndDate": {
                        "type": "STRING",
                        "description": "Ngày kết thúc kế hoạch (định dạng YYYY-MM-DD). Bắt buộc điền."
                    },
                    "totalDuration": {
                        "type": "INTEGER",
                        "description": "Tổng thời gian thực hiện kế hoạch (số ngày). Bắt buộc điền."
                    },
                    "steps": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "day": {
                                    "type": "INTEGER",
                                    "description": "Ngày thứ mấy trong kế hoạch (bắt đầu từ 1). Bắt buộc điền."
                                },
                                "date": {
                                    "type": "STRING",
                                    "description": "Ngày thực hiện (định dạng YYYY-MM-DD). Bắt buộc điền."
                                },
                                "title": {
                                    "type": "STRING",
                                    "description": "Tiêu đề công việc của ngày đó. Bắt buộc điền."
                                },
                                "description": {
                                    "type": "STRING",
                                    "description": "Mô tả chi tiết công việc cần làm. Bắt buộc điền."
                                },
                                "tasks": {
                                    "type": "ARRAY",
                                    "items": {
                                        "type": "STRING",
                                        "description": "Danh sách các nhiệm vụ cụ thể trong ngày."
                                    }
                                },
                                "materials": {
                                    "type": "ARRAY",
                                    "items": {
                                        "type": "STRING",
                                        "description": "Danh sách vật tư, dụng cụ cần thiết."
                                    }
                                },
                                "notes": {
                                    "type": "STRING",
                                    "description": "Ghi chú quan trọng (tuỳ chọn)."
                                },
                                "isUrgent": {
                                    "type": "BOOLEAN",
                                    "description": "Có phải công việc khẩn cấp không (tuỳ chọn)."
                                }
                            },
                            "required": [
                                "day",
                                "date",
                                "title",
                                "description",
                                "tasks",
                                "materials"
                            ]
                        }
                    },
                    "generalNotes": {
                        "type": "STRING",
                        "description": "Ghi chú chung cho toàn bộ kế hoạch. Bắt buộc điền."
                    },
                    "successIndicators": {
                        "type": "ARRAY",
                        "items": {
                            "type": "STRING",
                            "description": "Các dấu hiệu cho thấy kế hoạch thành công."
                        }
                    }
                },
                "required": [
                    "cropType",
                    "pestName",
                    "planStartDate",
                    "planEndDate",
                    "totalDuration",
                    "steps",
                    "generalNotes",
                    "successIndicators"
                ]
            }
        }
    };
}