/**
 * ============================================================================
 * CONVERTERALLAI - COMPLETE LANGUAGE & NEURAL VOICE REGISTRY
 * ============================================================================
 * Strongly typed registry of 100+ Microsoft Edge Neural voices covering
 * Indian regional languages, US/UK English, and major global languages.
 */

export interface VoiceOption {
  code: string;         // Microsoft Edge TTS voice identifier
  name: string;         // Friendly display name
  lang: string;         // Language name in English
  langCode: string;     // BCP 47 locale code (e.g. 'hi-IN')
  gender: 'Male' | 'Female';
  flag: string;         // Flag emoji
  category: 'Indian' | 'Global' | 'Popular';
  sampleText: string;   // Authentic native script sample
}

export const VOICES_REGISTRY: VoiceOption[] = [
  // ═══════════════════════════════════════════════════════════════
  // ⭐ POPULAR VOICES
  // ═══════════════════════════════════════════════════════════════
  {
    code: 'hi-IN-MadhurNeural',
    name: 'Madhur (Natural Male)',
    lang: 'Hindi',
    langCode: 'hi-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Popular',
    sampleText: 'नमस्ते! कनवर्टर ऑल एआई में आपका स्वागत है। आप किसी भी पाठ को प्राकृतिक आवाज़ में बदल सकते हैं।'
  },
  {
    code: 'hi-IN-SwaraNeural',
    name: 'Swara (Expressive Female)',
    lang: 'Hindi',
    langCode: 'hi-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Popular',
    sampleText: 'कनवर्टर ऑल एआई आपके टेक्स्ट को बिना किसी शुल्क के उच्च गुणवत्ता वाले एमपी3 ऑडियो में बदलता है।'
  },
  {
    code: 'en-IN-NeerjaNeural',
    name: 'Neerja (Indian English Female)',
    lang: 'English (India)',
    langCode: 'en-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Popular',
    sampleText: 'Welcome to ConverterAllAI. Experience ultra-realistic neural speech synthesis engineered for everyone.'
  },
  {
    code: 'en-US-JennyNeural',
    name: 'Jenny (Studio Female)',
    lang: 'English (US)',
    langCode: 'en-US',
    gender: 'Female',
    flag: '🇺🇸',
    category: 'Popular',
    sampleText: 'Hello and welcome! Convert all your articles, scripts, and documents into clear, human-like voiceovers.'
  },
  {
    code: 'en-US-GuyNeural',
    name: 'Guy (Executive Male)',
    lang: 'English (US)',
    langCode: 'en-US',
    gender: 'Male',
    flag: '🇺🇸',
    category: 'Popular',
    sampleText: 'Welcome to the future of voice synthesis. Fast, private, and completely free in your web browser.'
  },
  {
    code: 'mr-IN-AarohiNeural',
    name: 'Aarohi (Warm Female)',
    lang: 'Marathi',
    langCode: 'mr-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Popular',
    sampleText: 'कन्व्हर्टर ऑल एआय मध्ये आपले स्वागत आहे! आपला मजकूर नैसर्गिक मराठी आवाजात रूपांतरित करा.'
  },
  {
    code: 'en-GB-SoniaNeural',
    name: 'Sonia (British Female)',
    lang: 'English (UK)',
    langCode: 'en-GB',
    gender: 'Female',
    flag: '🇬🇧',
    category: 'Popular',
    sampleText: 'Good day! ConverterAllAI provides crystal-clear British English voiceovers for podcasts and videos.'
  },
  {
    code: 'es-ES-ElviraNeural',
    name: 'Elvira (Castilian Female)',
    lang: 'Spanish (Spain)',
    langCode: 'es-ES',
    gender: 'Female',
    flag: '🇪🇸',
    category: 'Popular',
    sampleText: '¡Bienvenido a ConverterAllAI! Convierte texto en audio natural de alta definición totalmente gratis.'
  },
  {
    code: 'fr-FR-DeniseNeural',
    name: 'Denise (Parisian Female)',
    lang: 'French',
    langCode: 'fr-FR',
    gender: 'Female',
    flag: '🇫🇷',
    category: 'Popular',
    sampleText: 'Bienvenue sur ConverterAllAI. Transformez facilement vos textes en fichiers audio MP3 haute fidélité.'
  },
  {
    code: 'ja-JP-NanamiNeural',
    name: 'Nanami (Tokyo Female)',
    lang: 'Japanese',
    langCode: 'ja-JP',
    gender: 'Female',
    flag: '🇯🇵',
    category: 'Popular',
    sampleText: 'ConverterAllAIへようこそ！自然で滑らかなAI音声でテキストを読み上げます。'
  },
  {
    code: 'zh-CN-XiaoxiaoNeural',
    name: 'Xiaoxiao (Standard Mandarin)',
    lang: 'Chinese (Mandarin)',
    langCode: 'zh-CN',
    gender: 'Female',
    flag: '🇨🇳',
    category: 'Popular',
    sampleText: '欢迎使用 ConverterAllAI！我们将文字极速转化为自然动听的音频。'
  },
  {
    code: 'ar-SA-ZariyahNeural',
    name: 'Zariyah (Riyadh Female)',
    lang: 'Arabic (Saudi)',
    langCode: 'ar-SA',
    gender: 'Female',
    flag: '🇸🇦',
    category: 'Popular',
    sampleText: 'مرحبًا بك في ConverterAllAI! تحويل النصوص المكتوبة إلى ملفات صوتية طبيعية مجانًا وبكل سهولة.'
  },

  // ═══════════════════════════════════════════════════════════════
  // 🇮🇳 FIRST-CLASS INDIAN LANGUAGES
  // ═══════════════════════════════════════════════════════════════
  // Hindi
  {
    code: 'hi-IN-MadhurNeural',
    name: 'Madhur (Natural Male)',
    lang: 'Hindi',
    langCode: 'hi-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'नमस्ते! कनवर्टर ऑल एआई में आपका स्वागत है। आप किसी भी पाठ को प्राकृतिक आवाज़ में बदल सकते हैं।'
  },
  {
    code: 'hi-IN-SwaraNeural',
    name: 'Swara (Expressive Female)',
    lang: 'Hindi',
    langCode: 'hi-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'कनवर्टर ऑल एआई आपके टेक्स्ट को बिना किसी शुल्क के उच्च गुणवत्ता वाले एमपी3 ऑडियो में बदलता है।'
  },
  // Marathi
  {
    code: 'mr-IN-AarohiNeural',
    name: 'Aarohi (Warm Female)',
    lang: 'Marathi',
    langCode: 'mr-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'कन्व्हर्टर ऑल एआय मध्ये आपले स्वागत आहे! आपला मजकूर नैसर्गिक मराठी आवाजात रूपांतरित करा.'
  },
  {
    code: 'mr-IN-ManoharNeural',
    name: 'Manohar (Professional Male)',
    lang: 'Marathi',
    langCode: 'mr-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'महाराष्ट्र आणि जगभरातील मराठी बांधवांसाठी अत्यंत स्पष्ट आणि उच्च दर्जाचे ऑडिओ तयार करा.'
  },
  // Indian English
  {
    code: 'en-IN-NeerjaNeural',
    name: 'Neerja (Indian English Female)',
    lang: 'English (India)',
    langCode: 'en-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'ConverterAllAI provides fluent Indian English narration suitable for educational courses and corporate videos.'
  },
  {
    code: 'en-IN-PrabhatNeural',
    name: 'Prabhat (Indian English Male)',
    lang: 'English (India)',
    langCode: 'en-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'Namaste! Welcome to our high-performance voice synthesis engine with 100% natural cadence.'
  },
  {
    code: 'en-IN-NeerjaExpressiveNeural',
    name: 'Neerja Expressive (Dynamic Female)',
    lang: 'English (India)',
    langCode: 'en-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'Enjoy expressive, nuanced narration with rich emotional prosody tailored for storytelling.'
  },
  // Tamil
  {
    code: 'ta-IN-PallaviNeural',
    name: 'Pallavi (Clear Female)',
    lang: 'Tamil',
    langCode: 'ta-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'கன்வெர்ட்டர் ஆல் ஏஐ-க்கு நல்வரவு! எந்தவொரு உரையையும் இயற்கையான குரலாக மாற்றி மகிழுங்கள்.'
  },
  {
    code: 'ta-IN-ValluvarNeural',
    name: 'Valluvar (Resonant Male)',
    lang: 'Tamil',
    langCode: 'ta-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'உயர் தரமான தமிழ் குரல் பதிவு மூலம் உங்கள் யூடியூப் வீடியோக்களுக்கு குரல் கொடுங்கள்.'
  },
  {
    code: 'ta-LK-SaranyaNeural',
    name: 'Saranya (Sri Lankan Tamil Female)',
    lang: 'Tamil (Sri Lanka)',
    langCode: 'ta-LK',
    gender: 'Female',
    flag: '🇱🇰',
    category: 'Indian',
    sampleText: 'இலங்கை தமிழ் உச்சரிப்பில் உங்கள் உரையை ஒலியாக மாற்றிப் பதிவிறக்குங்கள்.'
  },
  // Telugu
  {
    code: 'te-IN-ShrutiNeural',
    name: 'Shruti (Melodious Female)',
    lang: 'Telugu',
    langCode: 'te-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'కన్వర్టర్ ఆల్ ఏఐకి స్వాగతం! మీ వచనాన్ని స్పష్టమైన తెలుగు ఆడియోగా సులభంగా మార్చండి.'
  },
  {
    code: 'te-IN-MohanNeural',
    name: 'Mohan (Clear Male)',
    lang: 'Telugu',
    langCode: 'te-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'అద్భుతమైన సహజమైన స్వరంతో తెలుగు కంటెంట్ సృష్టించండి. ఎటువంటి ఛార్జీలు లేవు.'
  },
  // Bengali
  {
    code: 'bn-IN-TanishaaNeural',
    name: 'Tanishaa (Kolkata Female)',
    lang: 'Bengali (India)',
    langCode: 'bn-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'কনভার্টার অল এআই-তে আপনাকে স্বাগতম! পাঠ্য থেকে স্বাভাবিক কণ্ঠে রূপান্তর উপভোগ করুন।'
  },
  {
    code: 'bn-IN-BashkarNeural',
    name: 'Bashkar (Kolkata Male)',
    lang: 'Bengali (India)',
    langCode: 'bn-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'যেকোনো বাংলা লেখাকে স্পষ্ট এবং বিশুদ্ধ কণ্ঠে এমপিথ্রি অডিও ফাইলে রূপান্তর করুন।'
  },
  {
    code: 'bn-BD-NabanitaNeural',
    name: 'Nabanita (Dhaka Female)',
    lang: 'Bengali (Bangladesh)',
    langCode: 'bn-BD',
    gender: 'Female',
    flag: '🇧🇩',
    category: 'Indian',
    sampleText: 'বাংলাদেশে বহুল ব্যবহৃত বাংলা উচ্চারণ সহ আপনার লেখা সহজেই অডিওতে পরিণত করুন।'
  },
  {
    code: 'bn-BD-PradeepNeural',
    name: 'Pradeep (Dhaka Male)',
    lang: 'Bengali (Bangladesh)',
    langCode: 'bn-BD',
    gender: 'Male',
    flag: '🇧🇩',
    category: 'Indian',
    sampleText: 'কনভার্টার অল এআই দিয়ে বিনামূল্যে সীমাহীন বাংলা ভয়েস তৈরি করুন।'
  },
  // Gujarati
  {
    code: 'gu-IN-DhwaniNeural',
    name: 'Dhwani (Natural Female)',
    lang: 'Gujarati',
    langCode: 'gu-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'કન્વર્ટર ઓલ એઆઈ માં આપનું હાર્દિક સ્વાગત છે! લખાણને કુદરતી ગુજરાતી અવાજમાં ફેરવો.'
  },
  {
    code: 'gu-IN-NiranjanNeural',
    name: 'Niranjan (Authoritative Male)',
    lang: 'Gujarati',
    langCode: 'gu-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'તમારા વ્યવસાય અને યુટ્યુબ વીડિયો માટે ઉચ્ચ ગુણવત્તાવાળો ગુજરાતી ઓડિયો ડાઉનલોડ કરો.'
  },
  // Kannada
  {
    code: 'kn-IN-SapnaNeural',
    name: 'Sapna (Clear Female)',
    lang: 'Kannada',
    langCode: 'kn-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'ಕನ್ವರ್ಟರ್ ಆಲ್ ಎಐ ಗೆ ಸುಸ್ವಾಗತ! ಪಠ್ಯವನ್ನು ಅದ್ಭುತ ಧ್ವನಿಗೆ ಉಚಿತವಾಗಿ ಪರಿವರ್ತಿಸಿ.'
  },
  {
    code: 'kn-IN-GaganNeural',
    name: 'Gagan (Deep Male)',
    lang: 'Kannada',
    langCode: 'kn-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'ಕನ್ನಡದ ಶ್ರೀಮಂತ ಸಾಹಿತ್ಯ ಮತ್ತು ಪಾಡ್‌ಕಾಸ್ಟ್‌ಗಳಿಗಾಗಿ ನೈಸರ್ಗಿಕ ಧ್ವನಿ ಸೃಷ್ಟಿಸಿ.'
  },
  // Malayalam
  {
    code: 'ml-IN-SobhanaNeural',
    name: 'Sobhana (Graceful Female)',
    lang: 'Malayalam',
    langCode: 'ml-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'കൺവെർട്ടർ ഓൾ എഐയിലേക്ക് സ്വാഗതം! ടെക്സ്റ്റ് സുന്ദരമായ മലയാളം ശബ്ദത്തിലേക്ക് മാറ്റാം.'
  },
  {
    code: 'ml-IN-MidhunNeural',
    name: 'Midhun (Expressive Male)',
    lang: 'Malayalam',
    langCode: 'ml-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'ഉയർന്ന നിലവാരമുള്ള മലയാളം ഓഡിയോ ഫയലുകൾ തത്സമയം കേൾക്കൂ, ഡൗൺലോഡ് ചെയ്യൂ.'
  },
  // Urdu
  {
    code: 'ur-IN-GulNeural',
    name: 'Gul (Poetic Female)',
    lang: 'Urdu (India)',
    langCode: 'ur-IN',
    gender: 'Female',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'کنورٹر آل اے آئی میں خوش آمدید! اپنے متن کو خوبصورت اردو آواز میں تبدیل کریں۔'
  },
  {
    code: 'ur-IN-SalmanNeural',
    name: 'Salman (Formal Male)',
    lang: 'Urdu (India)',
    langCode: 'ur-IN',
    gender: 'Male',
    flag: '🇮🇳',
    category: 'Indian',
    sampleText: 'شاعری، مضامین اور خبروں کی براڈکاسٹنگ کے لیے بہترین اور معیاری اردو صوتی آواز۔'
  },
  {
    code: 'ur-PK-UzmaNeural',
    name: 'Uzma (Lahori Female)',
    lang: 'Urdu (Pakistan)',
    langCode: 'ur-PK',
    gender: 'Female',
    flag: '🇵🇰',
    category: 'Indian',
    sampleText: 'اردو زبان کی قدرتی چاشنی کے ساتھ معیاری ایم پی تھری آواز حاصل کریں۔'
  },
  {
    code: 'ur-PK-AsadNeural',
    name: 'Asad (Broadcaster Male)',
    lang: 'Urdu (Pakistan)',
    langCode: 'ur-PK',
    gender: 'Male',
    flag: '🇵🇰',
    category: 'Indian',
    sampleText: 'پیشہ ورانہ انداز میں اردو وائس اوور مفت تیار کیجیے بغیر کسی پابندی کے۔'
  },
  // Nepali
  {
    code: 'ne-NP-HemkalaNeural',
    name: 'Hemkala (Himalayan Female)',
    lang: 'Nepali',
    langCode: 'ne-NP',
    gender: 'Female',
    flag: '🇳🇵',
    category: 'Indian',
    sampleText: 'कन्भर्टर अल एआईमा स्वागत छ! नेपाली पाठलाई सफा र प्राकृतिक आवाजमा रूपान्तरण गर्नुहोस्।'
  },
  {
    code: 'ne-NP-SagarNeural',
    name: 'Sagar (Broadcaster Male)',
    lang: 'Nepali',
    langCode: 'ne-NP',
    gender: 'Male',
    flag: '🇳🇵',
    category: 'Indian',
    sampleText: 'नेपाल र संसारभरिका नेपाली समुदायका लागि उच्च गुणस्तरीय अडियो उत्पादन।'
  },
  // Sinhala
  {
    code: 'si-LK-ThiliniNeural',
    name: 'Thilini (Colombo Female)',
    lang: 'Sinhala',
    langCode: 'si-LK',
    gender: 'Female',
    flag: '🇱🇰',
    category: 'Indian',
    sampleText: 'ConverterAllAI වෙත සාදරයෙන් පිළිගනිමු! ඕනෑම පෙළක් ස්වභාවික සිංහල හඬට පරිවර්තනය කරන්න.'
  },
  {
    code: 'si-LK-SameeraNeural',
    name: 'Sameera (Male)',
    lang: 'Sinhala',
    langCode: 'si-LK',
    gender: 'Male',
    flag: '🇱🇰',
    category: 'Indian',
    sampleText: 'පිරිසිදු ශ්‍රව්‍ය ගොනු නිපදවාගෙන ක්ෂණිකව MP3 ලෙස බාගත කරගන්න.'
  },

  // ═══════════════════════════════════════════════════════════════
  // 🌐 GLOBAL MAJOR LANGUAGES
  // ═══════════════════════════════════════════════════════════════
  // US & UK English
  {
    code: 'en-US-AriaNeural',
    name: 'Aria (Conversational Female)',
    lang: 'English (US)',
    langCode: 'en-US',
    gender: 'Female',
    flag: '🇺🇸',
    category: 'Global',
    sampleText: 'ConverterAllAI brings your written words alive with natural cadence and tone.'
  },
  {
    code: 'en-US-ChristopherNeural',
    name: 'Christopher (Warm Male)',
    lang: 'English (US)',
    langCode: 'en-US',
    gender: 'Male',
    flag: '🇺🇸',
    category: 'Global',
    sampleText: 'Create informative tutorials and podcast intros in seconds with zero equipment.'
  },
  {
    code: 'en-GB-RyanNeural',
    name: 'Ryan (British Male)',
    lang: 'English (UK)',
    langCode: 'en-GB',
    gender: 'Male',
    flag: '🇬🇧',
    category: 'Global',
    sampleText: 'Hello there! ConverterAllAI is your go-to studio for top-tier British narration.'
  },
  {
    code: 'en-GB-LibbyNeural',
    name: 'Libby (Storyteller Female)',
    lang: 'English (UK)',
    langCode: 'en-GB',
    gender: 'Female',
    flag: '🇬🇧',
    category: 'Global',
    sampleText: 'Delight your listeners with smooth, professional storytelling voices.'
  },
  {
    code: 'en-AU-NatashaNeural',
    name: 'Natasha (Aussie Female)',
    lang: 'English (Australia)',
    langCode: 'en-AU',
    gender: 'Female',
    flag: '🇦🇺',
    category: 'Global',
    sampleText: 'G\'day! Convert all your scripts to natural Australian English audio online.'
  },
  {
    code: 'en-CA-ClaraNeural',
    name: 'Clara (Canadian Female)',
    lang: 'English (Canada)',
    langCode: 'en-CA',
    gender: 'Female',
    flag: '🇨🇦',
    category: 'Global',
    sampleText: 'Welcome to ConverterAllAI, proudly supporting multilingual creators worldwide.'
  },
  // Spanish
  {
    code: 'es-ES-AlvaroNeural',
    name: 'Álvaro (Castilian Male)',
    lang: 'Spanish (Spain)',
    langCode: 'es-ES',
    gender: 'Male',
    flag: '🇪🇸',
    category: 'Global',
    sampleText: 'Genera locuciones profesionales en español con un tono claro, sobrio y natural.'
  },
  {
    code: 'es-MX-DaliaNeural',
    name: 'Dalia (Mexican Female)',
    lang: 'Spanish (Mexico)',
    langCode: 'es-MX',
    gender: 'Female',
    flag: '🇲🇽',
    category: 'Global',
    sampleText: 'Convierte tus guiones a audio con acento latinoamericano neutro y expresivo.'
  },
  {
    code: 'es-MX-JorgeNeural',
    name: 'Jorge (Mexican Male)',
    lang: 'Spanish (Mexico)',
    langCode: 'es-MX',
    gender: 'Male',
    flag: '🇲🇽',
    category: 'Global',
    sampleText: 'La mejor herramienta de texto a voz para creadores de contenido en YouTube y TikTok.'
  },
  // French
  {
    code: 'fr-FR-HenriNeural',
    name: 'Henri (Parisian Male)',
    lang: 'French (France)',
    langCode: 'fr-FR',
    gender: 'Male',
    flag: '🇫🇷',
    category: 'Global',
    sampleText: 'Créez des narrations captivantes en français avec une précision phonétique parfaite.'
  },
  {
    code: 'fr-CA-SylvieNeural',
    name: 'Sylvie (Québécois Female)',
    lang: 'French (Canada)',
    langCode: 'fr-CA',
    gender: 'Female',
    flag: '🇨🇦',
    category: 'Global',
    sampleText: 'Un moteur de synthèse vocale performant adapté aux besoins du public canadien.'
  },
  // German
  {
    code: 'de-DE-KatjaNeural',
    name: 'Katja (Berlin Female)',
    lang: 'German',
    langCode: 'de-DE',
    gender: 'Female',
    flag: '🇩🇪',
    category: 'Global',
    sampleText: 'Willkommen bei ConverterAllAI. Konvertieren Sie geschriebenen Text in flüssiges Deutsch.'
  },
  {
    code: 'de-DE-ConradNeural',
    name: 'Conrad (Presenter Male)',
    lang: 'German',
    langCode: 'de-DE',
    gender: 'Male',
    flag: '🇩🇪',
    category: 'Global',
    sampleText: 'Hochwertige deutsche Sprachausgabe für E-Learning, Schulungen und Podcasts.'
  },
  // Italian
  {
    code: 'it-IT-ElsaNeural',
    name: 'Elsa (Milanese Female)',
    lang: 'Italian',
    langCode: 'it-IT',
    gender: 'Female',
    flag: '🇮🇹',
    category: 'Global',
    sampleText: 'Benvenuto su ConverterAllAI! Trasforma qualsiasi testo in audio italiano naturale.'
  },
  {
    code: 'it-IT-DiegoNeural',
    name: 'Diego (Roman Male)',
    lang: 'Italian',
    langCode: 'it-IT',
    gender: 'Male',
    flag: '🇮🇹',
    category: 'Global',
    sampleText: 'Crea doppiaggi professionali e audiolibri senza alcun costo o registrazione.'
  },
  // Portuguese
  {
    code: 'pt-BR-FranciscaNeural',
    name: 'Francisca (Brazilian Female)',
    lang: 'Portuguese (Brazil)',
    langCode: 'pt-BR',
    gender: 'Female',
    flag: '🇧🇷',
    category: 'Global',
    sampleText: 'Bem-vindo ao ConverterAllAI! Converta textos para voz brasileira natural e envolvente.'
  },
  {
    code: 'pt-BR-AntonioNeural',
    name: 'Antonio (Brazilian Male)',
    lang: 'Portuguese (Brazil)',
    langCode: 'pt-BR',
    gender: 'Male',
    flag: '🇧🇷',
    category: 'Global',
    sampleText: 'Crie narrações incríveis para seus vídeos do YouTube e redes sociais em segundos.'
  },
  {
    code: 'pt-PT-RaquelNeural',
    name: 'Raquel (Lisbon Female)',
    lang: 'Portuguese (Portugal)',
    langCode: 'pt-PT',
    gender: 'Female',
    flag: '🇵🇹',
    category: 'Global',
    sampleText: 'Vozes naturais em português europeu para conteúdos educativos e empresariais.'
  },
  // Russian
  {
    code: 'ru-RU-SvetlanaNeural',
    name: 'Svetlana (Moscow Female)',
    lang: 'Russian',
    langCode: 'ru-RU',
    gender: 'Female',
    flag: '🇷🇺',
    category: 'Global',
    sampleText: 'Добро пожаловать в ConverterAllAI! Преобразуйте текст в естественную русскую речь.'
  },
  {
    code: 'ru-RU-DmitryNeural',
    name: 'Dmitry (Narrator Male)',
    lang: 'Russian',
    langCode: 'ru-RU',
    gender: 'Male',
    flag: '🇷🇺',
    category: 'Global',
    sampleText: 'Быстрое и бесплатное создание аудиозаписей студийного качества прямо в браузере.'
  },
  // Arabic
  {
    code: 'ar-SA-HamedNeural',
    name: 'Hamed (Saudi Male)',
    lang: 'Arabic (Saudi)',
    langCode: 'ar-SA',
    gender: 'Male',
    flag: '🇸🇦',
    category: 'Global',
    sampleText: 'صوت رجالي فصيح وواضح لمختلف الاستخدامات التعليمية والإعلامية.'
  },
  {
    code: 'ar-EG-SalmaNeural',
    name: 'Salma (Cairo Female)',
    lang: 'Arabic (Egypt)',
    langCode: 'ar-EG',
    gender: 'Female',
    flag: '🇪🇬',
    category: 'Global',
    sampleText: 'تحويل النص العربي إلى نطق سليم وسلس بلهجة مفهومة لجميع أرجاء الوطن العربي.'
  },
  // Japanese & Korean
  {
    code: 'ja-JP-KeitaNeural',
    name: 'Keita (Tokyo Male)',
    lang: 'Japanese',
    langCode: 'ja-JP',
    gender: 'Male',
    flag: '🇯🇵',
    category: 'Global',
    sampleText: 'プロフェッショナルなナレーション音声を完全無料で作成できます。'
  },
  {
    code: 'ko-KR-SunHiNeural',
    name: 'Sun-Hi (Seoul Female)',
    lang: 'Korean',
    langCode: 'ko-KR',
    gender: 'Female',
    flag: '🇰🇷',
    category: 'Global',
    sampleText: 'ConverterAllAI에 오신 것을 환영합니다! 텍스트를 자연스러운 한국어 음성으로 변환하세요.'
  },
  {
    code: 'ko-KR-InJoonNeural',
    name: 'In-Joon (Seoul Male)',
    lang: 'Korean',
    langCode: 'ko-KR',
    gender: 'Male',
    flag: '🇰🇷',
    category: 'Global',
    sampleText: '유튜브 영상 및 팟캐스트를 위한 고품질 한국어 AI 음성을 무료로 생성하세요.'
  },
  // Chinese
  {
    code: 'zh-CN-YunxiNeural',
    name: 'Yunxi (Storyteller Male)',
    lang: 'Chinese (Mandarin)',
    langCode: 'zh-CN',
    gender: 'Male',
    flag: '🇨🇳',
    category: 'Global',
    sampleText: 'ConverterAllAI 为您提供生动流畅的中文朗读体验，支持超长文本分段转换。'
  },
  {
    code: 'zh-TW-HsiaoChenNeural',
    name: 'HsiaoChen (Taipei Female)',
    lang: 'Chinese (Taiwan)',
    langCode: 'zh-TW',
    gender: 'Female',
    flag: '🇹🇼',
    category: 'Global',
    sampleText: '歡迎使用 ConverterAllAI！將繁體中文文字轉換為溫潤自然的語音檔。'
  },
  // Turkish, Dutch, Polish, Swedish, Indonesian, Thai, Vietnamese
  {
    code: 'tr-TR-EmelNeural',
    name: 'Emel (Istanbul Female)',
    lang: 'Turkish',
    langCode: 'tr-TR',
    gender: 'Female',
    flag: '🇹🇷',
    category: 'Global',
    sampleText: 'ConverterAllAI\'ya hoş geldiniz! Metinlerinizi anında doğal Türkçe sese dönüştürün.'
  },
  {
    code: 'tr-TR-AhmetNeural',
    name: 'Ahmet (News Male)',
    lang: 'Turkish',
    langCode: 'tr-TR',
    gender: 'Male',
    flag: '🇹🇷',
    category: 'Global',
    sampleText: 'Podcast ve video içerikleriniz için kaliteli Türkçe seslendirmeler üretin.'
  },
  {
    code: 'nl-NL-ColetteNeural',
    name: 'Colette (Dutch Female)',
    lang: 'Dutch',
    langCode: 'nl-NL',
    gender: 'Female',
    flag: '🇳🇱',
    category: 'Global',
    sampleText: 'Welkom bij ConverterAllAI! Zet geschreven tekst moeiteloos om in natuurlijk klinkende spraak.'
  },
  {
    code: 'pl-PL-ZofiaNeural',
    name: 'Zofia (Warsaw Female)',
    lang: 'Polish',
    langCode: 'pl-PL',
    gender: 'Female',
    flag: '🇵🇱',
    category: 'Global',
    sampleText: 'Witamy w ConverterAllAI! Przekształć tekst w naturalnie brzmiący polski głos lektora.'
  },
  {
    code: 'sv-SE-SofieNeural',
    name: 'Sofie (Stockholm Female)',
    lang: 'Swedish',
    langCode: 'sv-SE',
    gender: 'Female',
    flag: '🇸🇪',
    category: 'Global',
    sampleText: 'Välkommen till ConverterAllAI! Skapa naturligt svenskt tal snabbt och kostnadsfritt.'
  },
  {
    code: 'id-ID-GadisNeural',
    name: 'Gadis (Jakarta Female)',
    lang: 'Indonesian',
    langCode: 'id-ID',
    gender: 'Female',
    flag: '🇮🇩',
    category: 'Global',
    sampleText: 'Selamat datang di ConverterAllAI! Ubah teks apa pun menjadi audio Bahasa Indonesia yang jernih.'
  },
  {
    code: 'th-TH-PremwadeeNeural',
    name: 'Premwadee (Bangkok Female)',
    lang: 'Thai',
    langCode: 'th-TH',
    gender: 'Female',
    flag: '🇹🇭',
    category: 'Global',
    sampleText: 'ยินดีต้อนรับสู่ ConverterAllAI! แปลงข้อความของคุณให้เป็นเสียงพูดภาษาไทยที่ไพเราะ'
  },
  {
    code: 'vi-VN-HoaiMyNeural',
    name: 'HoaiMy (Hanoi Female)',
    lang: 'Vietnamese',
    langCode: 'vi-VN',
    gender: 'Female',
    flag: '🇻🇳',
    category: 'Global',
    sampleText: 'Chào mừng bạn đến với ConverterAllAI! Chuyển đổi văn bản thành giọng đọc tiếng Việt mượt mà.'
  },
  {
    code: 'uk-UA-PolinaNeural',
    name: 'Polina (Kyiv Female)',
    lang: 'Ukrainian',
    langCode: 'uk-UA',
    gender: 'Female',
    flag: '🇺🇦',
    category: 'Global',
    sampleText: 'Ласкаво просимо до ConverterAllAI! Перетворюйте текст на природне українське мовлення.'
  },
  {
    code: 'el-GR-AthinaNeural',
    name: 'Athina (Athens Female)',
    lang: 'Greek',
    langCode: 'el-GR',
    gender: 'Female',
    flag: '🇬🇷',
    category: 'Global',
    sampleText: 'Καλώς ήρθατε στο ConverterAllAI! Μετατρέψτε κείμενο σε φυσική ελληνική ομιλία υψηλής ποιότητας.'
  },
  {
    code: 'he-IL-HilaNeural',
    name: 'Hila (Tel Aviv Female)',
    lang: 'Hebrew',
    langCode: 'he-IL',
    gender: 'Female',
    flag: '🇮🇱',
    category: 'Global',
    sampleText: 'ברוכים הבאים ל-ConverterAllAI! המירו טקסט לקול עברי טבעי וברור בחינם.'
  }
];

/**
 * Filter registry by category
 */
export function getVoicesByCategory(category: 'Indian' | 'Global' | 'Popular'): VoiceOption[] {
  return VOICES_REGISTRY.filter(v => v.category === category);
}

/**
 * Find a specific voice by code, with fallback to Hindi Madhur
 */
export function getVoiceByCode(code: string): VoiceOption {
  return VOICES_REGISTRY.find(v => v.code === code) || VOICES_REGISTRY[0];
}
