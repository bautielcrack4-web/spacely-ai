"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es' | 'zh' | 'hi' | 'ar';

interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        "nav.render": "Render",
        "nav.pricing": "Pricing",
        "nav.faq": "FAQ",
        "nav.upgrade": "Upgrade to PRO",
        "hero.title": "Your Dream Room in Seconds",
        "hero.subtitle": "Transform your space with AI. Upload a photo and see the magic happen instantly.",
        "hero.upload": "Transform My Room",
        "stats.users": "Happy Users",
        "stats.redesigns": "Room Redesigns",
        "features.title": "Why Spacely AI?",
        "pricing.title": "Simple, Transparent Pricing",
        "pricing.desc": "Choose the plan that fits your needs",
        "pricing.mostPopular": "Most Popular",
        "pricing.weekly": "Weekly Unlimited",
        "pricing.monthly": "Monthly Unlimited",
        "pricing.yearly": "Yearly Unlimited",
        "btn.startTrial": "Start 3-Day Free Trial",
        "faq.title": "Frequently Asked Questions",
        "footer.product": "Product",
        "footer.company": "Company",
        "footer.legal": "Legal",
        "footer.connect": "Connect",
        "styles.title": "Choose Your Style",
        "testimonials.title": "Loved by Designers & Homeowners",
    },
    es: {
        "nav.render": "Renderizar",
        "nav.pricing": "Precios",
        "nav.faq": "Preguntas",
        "nav.upgrade": "Mejorar a PRO",
        "hero.title": "Tu Habitación Soñada en Segundos",
        "hero.subtitle": "Transforma tu espacio con IA. Sube una foto y mira la magia ocurrir al instante.",
        "hero.upload": "Transformar Mi Habitación",
        "stats.users": "Usuarios Felices",
        "stats.redesigns": "Rediseños",
        "features.title": "¿Por qué Spacely AI?",
        "pricing.title": "Precios Simples y Transparentes",
        "pricing.desc": "Elige el plan que mejor se adapte a ti",
        "pricing.mostPopular": "Más Popular",
        "pricing.weekly": "Semanal Ilimitado",
        "pricing.monthly": "Mensual Ilimitado",
        "pricing.yearly": "Anual Ilimitado",
        "btn.startTrial": "Prueba Gratis de 3 Días",
        "faq.title": "Preguntas Frecuentes",
        "footer.product": "Producto",
        "footer.company": "Empresa",
        "footer.legal": "Legal",
        "footer.connect": "Conectar",
        "styles.title": "Elige Tu Estilo",
        "testimonials.title": "Amado por Diseñadores y Propietarios",
    },
    zh: {
        "nav.render": "渲染",
        "nav.pricing": "价格",
        "nav.faq": "常见问题",
        "nav.upgrade": "升级到 PRO",
        "hero.title": "几秒钟内打造您的梦想房间",
        "hero.subtitle": "利用AI改造您的空间。上传照片，立即可见神奇效果。",
        "hero.upload": "改造我的房间",
        "stats.users": "快乐用户",
        "stats.redesigns": "房间重新设计",
        "features.title": "为什么选择 Spacely AI？",
        "pricing.title": "简单透明的价格",
        "pricing.desc": "选择适合您的计划",
        "pricing.mostPopular": "最受欢迎",
        "pricing.weekly": "每周无限",
        "pricing.monthly": "每月无限",
        "pricing.yearly": "每年无限",
        "btn.startTrial": "开始 3 天免费试用",
        "faq.title": "常见问题",
        "footer.product": "产品",
        "footer.company": "公司",
        "footer.legal": "法律",
        "footer.connect": "联系",
        "styles.title": "选择您的风格",
        "testimonials.title": "深受设计师和业主的喜爱",
    },
    hi: {
        "nav.render": "रेंडर",
        "nav.pricing": "मूल्य निर्धारण",
        "nav.faq": "सामान्य प्रश्न",
        "nav.upgrade": "PRO में अपग्रेड करें",
        "hero.title": "सेकंड में आपका सपनो का कमरा",
        "hero.subtitle": "AI के साथ अपनी जगह बदलें। एक फोटो अपलोड करें और तुरंत जादू देखें।",
        "hero.upload": "मेरा कमरा बदलें",
        "stats.users": "खुश उपयोगकर्ता",
        "stats.redesigns": "कमरा रिडिजाइन",
        "features.title": "Spacely AI क्यों?",
        "pricing.title": "सरल, पारदर्शी मूल्य निर्धारण",
        "pricing.desc": "वह योजना चुनें जो आपकी आवश्यकताओं के अनुरूप हो",
        "pricing.mostPopular": "सर्वाधिक लोकप्रिय",
        "pricing.weekly": "साप्ताहिक असीमित",
        "pricing.monthly": "मासिक असीमित",
        "pricing.yearly": "वार्षिक असीमित",
        "btn.startTrial": "3-दिन का निःशुल्क परीक्षण शुरू करें",
        "faq.title": "अक्सर पूछे जाने वाले प्रश्न",
        "footer.product": "उत्पाद",
        "footer.company": "कंपनी",
        "footer.legal": "कानूनी",
        "footer.connect": "जुड़ें",
        "styles.title": "अपनी शैली चुनें",
        "testimonials.title": "डिजाइनरों और घर के मालिकों द्वारा पसंद किया गया",
    },
    ar: {
        "nav.render": "تصيير",
        "nav.pricing": "التسعير",
        "nav.faq": "الأسئلة الشائعة",
        "nav.upgrade": "الترقية الى PRO",
        "hero.title": "غرفة أحلامك في ثوانٍ",
        "hero.subtitle": "حول مساحتك باستخدام الذكاء الاصطناعي. قم بتحميل صورة وشاهد السحر يحدث على الفور.",
        "hero.upload": "حول غرفتي",
        "stats.users": "مستخدمون سعداء",
        "stats.redesigns": "إعادة تصميم الغرف",
        "features.title": "لماذا Spacely AI؟",
        "pricing.title": "تسعير بسيط وشفاف",
        "pricing.desc": "اختر الخطة التي تناسب احتياجاتك",
        "pricing.mostPopular": "الأكثر شيوعًا",
        "pricing.weekly": "أسبوعي غير محدود",
        "pricing.monthly": "شهري غير محدود",
        "pricing.yearly": "سنوي غير محدود",
        "btn.startTrial": "ابدأ إصدار تجريبي مجاني لمدة 3 أيام",
        "faq.title": "أسئلة مكررة",
        "footer.product": "المنتج",
        "footer.company": "الشركة",
        "footer.legal": "قانوني",
        "footer.connect": "تواصل",
        "styles.title": "اختر طرازك",
        "testimonials.title": "محبوب من قبل المصممين وأصحاب المنازل",
    }
};

const LanguageContext = createContext<TranslationContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
