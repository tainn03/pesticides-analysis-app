import z from "zod";

export const PestAnalysisRequestValidator = z.object({
    cropType: z.string().min(1, "Thiếu loại cây trồng"),
    symptoms: z.string().min(1, "Thiếu triệu chứng"),
});
