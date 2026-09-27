import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
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
        loadComponent: () => import('./pages/audio-processing/audio-processing-home/audio-processing-home.component').then(m => m.AudioProcessingHomeComponent)
    },
    {
        path: 'audio-processing/audio-cutter',
        loadComponent: () => import('./pages/audio-processing/audio-cutter/audio-cutter.component').then(m => m.AudioCutterComponent)
    },
    {
        path: 'audio-processing/volume-booster',
        loadComponent: () => import('./pages/audio-processing/volume-booster/volume-booster.component').then(m => m.VolumeBoosterComponent)
    },
    {
        path: 'audio-processing/speed-changer',
        loadComponent: () => import('./pages/audio-processing/speed-changer/speed-changer.component').then(m => m.SpeedChangerComponent)
    },
    {
        path: 'audio-processing/audio-reverser',
        loadComponent: () => import('./pages/audio-processing/audio-reverser/audio-reverser.component').then(m => m.AudioReverserComponent)
    },
    {
        path: 'audio-processing/equalizer',
        loadComponent: () => import('./pages/audio-processing/equalizer/equalizer.component').then(m => m.EqualizerComponent)
    },
    {
        path: 'audio-processing/audio-compressor',
        loadComponent: () => import('./pages/audio-processing/audio-compressor/audio-compressor.component').then(m => m.AudioCompressorComponent)
    },
    {
        path: 'audio-processing/video-to-audio',
        loadComponent: () => import('./pages/audio-processing/video-to-audio/video-to-audio.component').then(m => m.VideoToAudioComponent)
    },
    {
        path: 'audio-processing/format-converter',
        loadComponent: () => import('./pages/audio-processing/format-converter/format-converter.component').then(m => m.FormatConverterComponent)
    },
    {
        path: 'audio-processing/audio-joiner',
        loadComponent: () => import('./pages/audio-processing/audio-joiner/audio-joiner.component').then(m => m.AudioJoinerComponent)
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
        path: 'audio-processing/audio-editor',
        loadComponent: () => import('./pages/audio-processing/audio-editor/audio-editor.component').then(m => m.AudioEditorComponent)
    },
    {
        path: 'audio-editor',
        redirectTo: 'audio-processing/audio-editor',
        pathMatch: 'full'
    },
    {
        path: 'audio-processing/voice-cloning',
        loadComponent: () => import('./pages/audio-processing/voice-cloning/voice-cloning.component').then(m => m.VoiceCloningComponent)
    },
    {
        path: 'voice-cloning',
        redirectTo: 'audio-processing/voice-cloning',
        pathMatch: 'full'
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
        path: 'games',
        loadComponent: () => import('./pages/games/games-home/games-home.component').then(m => m.GamesHomeComponent)
    },
    {
        path: 'games/chess',
        loadComponent: () => import('./pages/games/chess/chess.component').then(m => m.ChessComponent)
    },
    {
        path: 'games/warfare-3000',
        loadComponent: () => import('./pages/games/warfare-3000/warfare-3000.component').then(m => m.Warfare3000Component)
    },
      {
          path: 'games/teen-do-paanch',
          loadComponent: () => import('./pages/games/teen-do-paanch/teen-do-paanch').then(m => m.TeenDoPaanch)
      },
      {
          path: 'games/snakes-ladders',
          loadComponent: () => import('./pages/games/snakes-ladders/snakes-ladders').then(m => m.SnakesLadders)
      },
      {
          path: 'games/ludo',
          loadComponent: () => import('./pages/games/ludo/ludo').then(m => m.Ludo)
      },
      {
          path: 'games/spelling-bee',
          loadComponent: () => import('./pages/games/spelling-bee/spelling-bee').then(m => m.SpellingBee)
      },

    {
        path: 'games/teen-patti',
        loadComponent: () => import('./pages/games/teen-patti/teen-patti.component').then(m => m.TeenPattiComponent)
    },
    
    {
        path: 'games/sudoku',
        loadComponent: () => import('./pages/games/sudoku/sudoku.component').then(m => m.SudokuComponent)
    },
    
    
    {
        path: 'games/snake',
        loadComponent: () => import('./pages/games/snake-game/snake-game.component').then(m => m.SnakeGameComponent)
    },
    {
        path: 'games/memory-match',
        loadComponent: () => import('./pages/games/memory-match/memory-match.component').then(m => m.MemoryMatchComponent)
    },
    {
        path: 'games/tic-tac-toe',
        loadComponent: () => import('./pages/games/tic-tac-toe/tic-tac-toe.component').then(m => m.TicTacToeComponent)
    },
    {
        path: 'games/typing-test',
        redirectTo: 'typing-master',
        pathMatch: 'full'
    },
    {
        path: 'typing-master',
        loadComponent: () => import('./pages/typing-master/typing-master.component').then(m => m.TypingMasterComponent)
    },
    {
        path: 'typing-tutor',
        redirectTo: 'typing-master',
        pathMatch: 'full'
    },
    {
        path: 'typing-test',
        redirectTo: 'typing-master',
        pathMatch: 'full'
    },
    {
        path: 'games/brick-breaker',
        loadComponent: () => import('./pages/games/brick-breaker/brick-breaker.component').then(m => m.BrickBreakerComponent)
    },
    {
        path: 'games/pong',
        loadComponent: () => import('./pages/games/pong/pong.component').then(m => m.PongComponent)
    },
    
    {
        path: 'resume-builder',
        loadComponent: () => import('./pages/resume-builder/resume-builder.component').then(m => m.ResumeBuilderComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/legal/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'about-us',
        redirectTo: 'about',
        pathMatch: 'full'
    },
    {
        path: 'contact',
        loadComponent: () => import('./pages/legal/contact/contact.component').then(m => m.ContactComponent)
    },
    {
        path: 'contact-us',
        redirectTo: 'contact',
        pathMatch: 'full'
    },
    {
        path: 'privacy-policy',
        loadComponent: () => import('./pages/legal/privacy/privacy.component').then(m => m.PrivacyComponent)
    },
    {
        path: 'privacy',
        redirectTo: 'privacy-policy',
        pathMatch: 'full'
    },
    {
        path: 'terms-of-service',
        loadComponent: () => import('./pages/legal/terms/terms.component').then(m => m.TermsComponent)
    },
    {
        path: 'terms',
        redirectTo: 'terms-of-service',
        pathMatch: 'full'
    },
    {
        path: 'disclaimer',
        loadComponent: () => import('./pages/legal/disclaimer/disclaimer.component').then(m => m.DisclaimerComponent)
    },
    {
        path: 'cookie-policy',
        loadComponent: () => import('./pages/legal/cookie-policy/cookie-policy.component').then(m => m.CookiePolicyComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'analytics',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
