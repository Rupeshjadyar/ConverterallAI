import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'calculators',
        loadComponent: () =>
            import('./pages/calculators/calculators-wrapper.component').then(m => m.CalculatorsWrapperComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/calculators-home/calculators-home').then(m => m.CalculatorsHome)
            },
            {
                path: 'basic',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/basic-calculator/basic-calculator').then(m => m.BasicCalculator)
            },
            {
                path: 'bmi',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/bmi-calculator/bmi-calculator').then(m => m.BmiCalculator)
            },
            {
                path: 'percentage',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/percentage-calculator/percentage-calculator').then(m => m.PercentageCalculator)
            },
            {
                path: 'emi',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/emi-calculator/emi-calculator').then(m => m.EmiCalculator)
            },
            {
                path: 'age',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/age-calculator/age-calculator').then(m => m.AgeCalculator)
            },
            {
                path: 'gst',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/gst-calculator/gst-calculator').then(m => m.GstCalculator)
            },
            {
                path: 'discount',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/discount-calculator/discount-calculator').then(m => m.DiscountCalculator)
            },
            {
                path: 'sip',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/sip-calculator/sip-calculator').then(m => m.SipCalculator)
            },
            {
                path: 'cgpa',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/cgpa-calculator/cgpa-calculator').then(m => m.CgpaCalculator)
            },
            {
                path: 'loan',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/loan-calculator/loan-calculator').then(m => m.LoanCalculator)
            },
            {
                path: 'date',
                loadComponent: () =>
                    import('./pages/calculators/home/calculators/date-calculator/date-calculator').then(m => m.DateCalculator)
            }
        ]
    },
    {
        path: 'image-processing',
        loadComponent: () => import('./pages/image-processing/image-processing-home/image-processing-home')
            .then(m => m.ImageProcessingHome)
    },
    {
        path: 'image-Compressor',
        loadComponent: () => import('./pages/image-processing/image-compressor/image-compressor')
            .then(m => m.ImageCompressor)
    },
    {
        path: 'image-processing/format-converter',
        loadComponent: () => import('./pages/image-processing/format-converter/format-converter').then(m => m.FormatConverterComponent)
    },
    {
        path: 'image-processing/cropper',
        loadComponent: () => import('./pages/image-processing/cropper/cropper').then(m => m.CropperComponent)
    },
    {
        path: 'image-processing/compressor',
        loadComponent: () => import('./pages/image-processing/compressor/compressor').then(m => m.CompressorComponent)
    },
    {
        path: 'image-processing/bg-remover',
        loadComponent: () => import('./pages/image-processing/bg-remover/bg-remover').then(m => m.BgRemoverComponent)
    },
    {
        path: 'image-processing/image-to-pdf',
        loadComponent: () => import('./pages/image-processing/image-to-pdf/image-to-pdf').then(m => m.ImageToPdfComponent)
    },
    {
        path: 'image-processing/editor',
        loadComponent: () => import('./pages/image-processing/image-editor/image-editor').then(m => m.ImageEditorComponent)
    },
    {
        path: 'tts',
        loadComponent: () => import('./pages/audio-processing/tts/tts-index/tts-index.component').then(m => m.TtsIndexComponent)
    },
    {
        path: 'tts/:slug',
        loadComponent: () => import('./pages/audio-processing/tts/tts-language/tts-language.component').then(m => m.TtsLanguageComponent)
    },
    {
        path: 'audio-processing',
        redirectTo: 'tts',
        pathMatch: 'full'
    },
    {
        path: 'audio-processing/tts',
        loadComponent: () => import('./pages/audio-processing/tts/tts-index/tts-index.component').then(m => m.TtsIndexComponent)
    },
    {
        path: 'audio-processing/tts/:slug',
        loadComponent: () => import('./pages/audio-processing/tts/tts-language/tts-language.component').then(m => m.TtsLanguageComponent)
    },
    {
        path: 'audio-processing/text-to-mp3',
        loadComponent: () => import('./pages/audio-processing/text-to-mp3/text-to-mp3.component').then(m => m.TextToMp3Component)
    },
    {
        path: 'pdf-processing',
        loadComponent: () => import('./pages/pdf-processing/pdf-processing-home/pdf-processing-home.component').then(m => m.PdfProcessingHomeComponent)
    },
    {
        path: 'pdf-processing/merge-pdf',
        loadComponent: () => import('./pages/pdf-processing/merge-pdf/merge-pdf.component').then(m => m.MergePdfComponent)
    },
    {
        path: 'pdf-processing/split-pdf',
        loadComponent: () => import('./pages/pdf-processing/split-pdf/split-pdf.component').then(m => m.SplitPdfComponent)
    },
    {
        path: 'pdf-processing/compress-pdf',
        loadComponent: () => import('./pages/pdf-processing/compress-pdf/compress-pdf.component').then(m => m.CompressPdfComponent)
    },
    {
        path: 'pdf-processing/pdf-to-word',
        loadComponent: () => import('./pages/pdf-processing/pdf-to-word/pdf-to-word.component').then(m => m.PdfToWordComponent)
    },
    {
        path: 'pdf-processing/pdf-to-ppt',
        loadComponent: () => import('./pages/pdf-processing/pdf-to-ppt/pdf-to-ppt.component').then(m => m.PdfToPptComponent)
    },
    {
        path: 'pdf-processing/pdf-to-excel',
        loadComponent: () => import('./pages/pdf-processing/pdf-to-excel/pdf-to-excel.component').then(m => m.PdfToExcelComponent)
    },
    {
        path: 'pdf-processing/word-to-pdf',
        loadComponent: () => import('./pages/pdf-processing/word-to-pdf/word-to-pdf.component').then(m => m.WordToPdfComponent)
    },
    {
        path: 'pdf-processing/ppt-to-pdf',
        loadComponent: () => import('./pages/pdf-processing/ppt-to-pdf/ppt-to-pdf.component').then(m => m.PptToPdfComponent)
    },
    {
        path: 'pdf-processing/excel-to-pdf',
        loadComponent: () => import('./pages/pdf-processing/excel-to-pdf/excel-to-pdf.component').then(m => m.ExcelToPdfComponent)
    },
    {
        path: 'pdf-processing/edit-pdf',
        loadComponent: () => import('./pages/pdf-processing/edit-pdf/edit-pdf.component').then(m => m.EditPdfComponent)
    },
    {
        path: 'pdf-processing/pdf-to-jpg',
        loadComponent: () => import('./pages/pdf-processing/pdf-to-jpg/pdf-to-jpg.component').then(m => m.PdfToJpgComponent)
    },
    {
        path: 'pdf-processing/jpg-to-pdf',
        loadComponent: () => import('./pages/pdf-processing/jpg-to-pdf/jpg-to-pdf.component').then(m => m.JpgToPdfComponent)
    },
    {
        path: 'pdf-processing/sign-pdf',
        loadComponent: () => import('./pages/pdf-processing/sign-pdf/sign-pdf.component').then(m => m.SignPdfComponent)
    },
    {
        path: 'pdf-processing/add-watermark',
        loadComponent: () => import('./pages/pdf-processing/add-watermark/add-watermark.component').then(m => m.AddWatermarkComponent)
    },
    {
        path: 'pdf-processing/rotate-pdf',
        loadComponent: () => import('./pages/pdf-processing/rotate-pdf/rotate-pdf.component').then(m => m.RotatePdfComponent)
    },
    {
        path: 'pdf-processing/html-to-pdf',
        loadComponent: () => import('./pages/pdf-processing/html-to-pdf/html-to-pdf.component').then(m => m.HtmlToPdfComponent)
    },
    {
        path: 'pdf-processing/remove-password',
        loadComponent: () => import('./pages/pdf-processing/remove-password/remove-password.component').then(m => m.RemovePasswordComponent)
    },
    {
        path: 'pdf-processing/add-password',
        loadComponent: () => import('./pages/pdf-processing/add-password/add-password.component').then(m => m.AddPasswordComponent)
    },
    {
        path: 'pdf-processing/organize-pdf',
        loadComponent: () => import('./pages/pdf-processing/organize-pdf/organize-pdf.component').then(m => m.OrganizePdfComponent)
    },
    {
        path: 'pdf-processing/pdf-to-pdfa',
        loadComponent: () => import('./pages/pdf-processing/pdf-to-pdfa/pdf-to-pdfa.component').then(m => m.PdfToPdfaComponent)
    },
    {
        path: 'pdf-processing/repair-pdf',
        loadComponent: () => import('./pages/pdf-processing/repair-pdf/repair-pdf.component').then(m => m.RepairPdfComponent)
    },
    {
        path: 'pdf-processing/add-page-numbers',
        loadComponent: () => import('./pages/pdf-processing/add-page-numbers/add-page-numbers.component').then(m => m.AddPageNumbersComponent)
    },
    {
        path: 'pdf-processing/scan-to-pdf',
        loadComponent: () => import('./pages/pdf-processing/scan-to-pdf/scan-to-pdf.component').then(m => m.ScanToPdfComponent)
    },
    {
        path: 'pdf-processing/ocr-pdf',
        loadComponent: () => import('./pages/pdf-processing/ocr-pdf/ocr-pdf.component').then(m => m.OcrPdfComponent)
    },
    {
        path: 'pdf-processing/compare-pdf',
        loadComponent: () => import('./pages/pdf-processing/compare-pdf/compare-pdf.component').then(m => m.ComparePdfComponent)
    },
    {
        path: 'pdf-processing/redact-pdf',
        loadComponent: () => import('./pages/pdf-processing/redact-pdf/redact-pdf.component').then(m => m.RedactPdfComponent)
    },
    {
        path: 'pdf-processing/crop-pdf',
        loadComponent: () => import('./pages/pdf-processing/crop-pdf/crop-pdf.component').then(m => m.CropPdfComponent)
    },
    {
        path: 'pdf-processing/pdf-forms',
        loadComponent: () => import('./pages/pdf-processing/pdf-forms/pdf-forms.component').then(m => m.PdfFormsComponent)
    },
    {
        path: 'pdf-processing/ai-summarizer',
        loadComponent: () => import('./pages/pdf-processing/ai-summarizer/ai-summarizer.component').then(m => m.AiSummarizerComponent)
    },
    {
        path: 'pdf-processing/translate-pdf',
        loadComponent: () => import('./pages/pdf-processing/translate-pdf/translate-pdf.component').then(m => m.TranslatePdfComponent)
    },
    {
        path: 'pdf-processing/pdf-to-text',
        loadComponent: () => import('./pages/pdf-processing/pdf-to-text/pdf-to-text.component').then(m => m.PdfToTextComponent)
    },
    {
        path: 'pdf-processing/text-to-pdf',
        loadComponent: () => import('./pages/pdf-processing/text-to-pdf/text-to-pdf.component').then(m => m.TextToPdfComponent)
    },
    {
        path: 'resume-builder',
        loadComponent: () => import('./pages/resume-builder/resume-builder.component').then(m => m.ResumeBuilderComponent)
    }
];

//C:\Users\Rupesh\OneDrive\Desktop\converterallai\converterallai\src\app\pages\calculators\home\calculators\emi-calculator\emi-calculator.ts