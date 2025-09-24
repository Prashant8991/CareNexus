import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.skinCheck": "Skin Check",
      "nav.firstAid": "First Aid",
      "nav.hospitals": "Hospitals",
      "nav.sos": "SOS",
      "nav.dashboard": "Dashboard",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.retry": "Retry",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.back": "Back",
      "common.next": "Next",
      "common.previous": "Previous",
      "common.close": "Close",
      "common.ok": "OK",
      "common.yes": "Yes",
      "common.no": "No",
      
      // Home page
      "home.title": "AI Health Companion",
      "home.subtitle": "Your intelligent healthcare assistant powered by AI",
      "home.description": "Get instant health analysis, emergency assistance, and medical guidance all in one place. Our AI-powered tools help you make informed decisions about your health.",
      "home.getStarted": "Get Started",
      "home.learnMore": "Learn More",
      
      // Skin Check
      "skinCheck.title": "AI Skin Analysis",
      "skinCheck.subtitle": "Upload a photo or use live camera for instant skin condition detection",
      "skinCheck.disclaimer": "⚠️ Medical Disclaimer: This tool provides general information only and is not a substitute for professional medical advice.",
      "skinCheck.uploadTab": "Upload Photo",
      "skinCheck.liveTab": "Live Camera",
      "skinCheck.uploadImage": "Upload Image",
      "skinCheck.dragDrop": "Drag and drop an image here, or click to select",
      "skinCheck.analyzeSkin": "Analyze Skin",
      "skinCheck.analyzing": "Analyzing your skin...",
      "skinCheck.analysisComplete": "Analysis Complete",
      "skinCheck.condition": "Detected Condition",
      "skinCheck.confidence": "Confidence",
      "skinCheck.recommendations": "Recommendations",
      "skinCheck.newAnalysis": "Start New Analysis",
      
      // Live Camera
      "camera.title": "Live Skin Analysis",
      "camera.subtitle": "Real-time skin condition detection using your camera",
      "camera.notActive": "Camera Not Active",
      "camera.clickToStart": "Click \"Start Camera\" to begin live analysis",
      "camera.startCamera": "Start Camera",
      "camera.stopCamera": "Stop Camera",
      "camera.analyzeNow": "Analyze Now",
      "camera.autoAnalysis": "Auto Analysis",
      "camera.stopAuto": "Stop Auto",
      "camera.analyzing": "Analyzing...",
      "camera.liveDetection": "Live Detection",
      "camera.currentAnalysis": "Current Analysis",
      "camera.analysisHistory": "Analysis History",
      "camera.recent": "Recent detections from your live session",
      "camera.error": "Camera access denied or not available. Please check permissions.",
      
      // First Aid
      "firstAid.title": "First Aid Assistant",
      "firstAid.subtitle": "Get step-by-step emergency guidance",
      
      // Hospitals
      "hospitals.title": "Find Nearby Hospitals",
      "hospitals.subtitle": "Locate medical facilities near you with real-time information",
      "hospitals.search": "Search hospitals, services, or location...",
      "hospitals.filterBy": "Filter by:",
      "hospitals.allTypes": "All Types",
      "hospitals.general": "General Hospital",
      "hospitals.emergency": "Emergency Only",
      "hospitals.urgentCare": "Urgent Care",
      "hospitals.specialty": "Specialty Care",
      "hospitals.emergencyOnly": "Emergency Room only",
      "hospitals.callHospital": "Call Hospital",
      "hospitals.getDirections": "Get Directions",
      "hospitals.navigateFromLocation": "Navigate from My Location",
      "hospitals.viewOnMaps": "View on Google Maps",
      "hospitals.emergencyCall": "Emergency Call",
      "hospitals.servicesAvailable": "Services Available:",
      "hospitals.noHospitals": "No hospitals found",
      "hospitals.adjustCriteria": "Try adjusting your search criteria or location",
      "hospitals.locationServices": "Location Services",
      "hospitals.enableLocation": "Enable location services to see more accurate distances",
      "hospitals.currentLocation": "Current Location",
      "hospitals.enableLocationText": "Enable location sharing for faster emergency response",
      "hospitals.enableLocationBtn": "Enable Location",
      "hospitals.liveLocation": "Use Live Location",
      "hospitals.stopLive": "Stop Live",
      "hospitals.locating": "Locating...",
      "hospitals.openInMaps": "Open in Google Maps",
      "hospitals.hospitalsNearMe": "Hospitals Near Me",
      
      // SOS
      "sos.title": "Emergency SOS",
      "sos.subtitle": "Quick access to emergency contacts and services",
      
      // Dashboard  
      "dashboard.title": "Health Dashboard",
      "dashboard.subtitle": "Track your health metrics and history",
      
      // Language Switcher
      "language.select": "Select Language",
      "language.en": "English",
      "language.hi": "हिन्दी",
      "language.ta": "தமிழ்"
    }
  },
  hi: {
    translation: {
      // Navigation
      "nav.home": "होम",
      "nav.skinCheck": "त्वचा जांच",
      "nav.firstAid": "प्राथमिक चिकित्सा",
      "nav.hospitals": "अस्पताल",
      "nav.sos": "SOS",
      "nav.dashboard": "डैशबोर्ड",
      
      // Common
      "common.loading": "लोड हो रहा है...",
      "common.error": "त्रुटि",
      "common.retry": "पुनः प्रयास",
      "common.cancel": "रद्द करें",
      "common.save": "सेव करें",
      "common.delete": "हटाएं",
      "common.edit": "संपादित करें",
      "common.back": "वापस",
      "common.next": "अगला",
      "common.previous": "पिछला",
      "common.close": "बंद करें",
      "common.ok": "ठीक है",
      "common.yes": "हां",
      "common.no": "नहीं",
      
      // Home page
      "home.title": "AI स्वास्थ्य साथी",
      "home.subtitle": "AI द्वारा संचालित आपका बुद्धिमान स्वास्थ्य सहायक",
      "home.description": "तत्काल स्वास्थ्य विश्लेषण, आपातकालीन सहायता, और चिकित्सा मार्गदर्शन एक ही स्थान पर प्राप्त करें। हमारे AI-संचालित उपकरण आपको अपने स्वास्थ्य के बारे में सूचित निर्णय लेने में मदद करते हैं।",
      "home.getStarted": "शुरू करें",
      "home.learnMore": "और जानें",
      
      // Skin Check
      "skinCheck.title": "AI त्वचा विश्लेषण",
      "skinCheck.subtitle": "तत्काल त्वचा की स्थिति का पता लगाने के लिए फोटो अपलोड करें या लाइव कैमरा का उपयोग करें",
      "skinCheck.disclaimer": "⚠️ चिकित्सा अस्वीकरण: यह उपकरण केवल सामान्य जानकारी प्रदान करता है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।",
      "skinCheck.uploadTab": "फोटो अपलोड",
      "skinCheck.liveTab": "लाइव कैमरा",
      "skinCheck.uploadImage": "छवि अपलोड करें",
      "skinCheck.dragDrop": "यहाँ एक छवि खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
      "skinCheck.analyzeSkin": "त्वचा का विश्लेषण करें",
      "skinCheck.analyzing": "आपकी त्वचा का विश्लेषण हो रहा है...",
      "skinCheck.analysisComplete": "विश्लेषण पूरा",
      "skinCheck.condition": "पहचानी गई स्थिति",
      "skinCheck.confidence": "विश्वास",
      "skinCheck.recommendations": "सिफारिशें",
      "skinCheck.newAnalysis": "नया विश्लेषण शुरू करें",
      
      // Live Camera
      "camera.title": "लाइव त्वचा विश्लेषण",
      "camera.subtitle": "आपके कैमरे का उपयोग करके वास्तविक समय में त्वचा की स्थिति का पता लगाना",
      "camera.notActive": "कैमरा सक्रिय नहीं है",
      "camera.clickToStart": "लाइव विश्लेषण शुरू करने के लिए \"कैमरा शुरू करें\" पर क्लिक करें",
      "camera.startCamera": "कैमरा शुरू करें",
      "camera.stopCamera": "कैमरा बंद करें",
      "camera.analyzeNow": "अभी विश्लेषण करें",
      "camera.autoAnalysis": "ऑटो विश्लेषण",
      "camera.stopAuto": "ऑटो बंद करें",
      "camera.analyzing": "विश्लेषण हो रहा है...",
      "camera.liveDetection": "लाइव डिटेक्शन",
      "camera.currentAnalysis": "वर्तमान विश्लेषण",
      "camera.analysisHistory": "विश्लेषण इतिहास",
      "camera.recent": "आपके लाइव सत्र से हाल की खोजें",
      "camera.error": "कैमरा एक्सेस अस्वीकृत या उपलब्ध नहीं है। कृपया अनुमतियां जांचें।",
      
      // First Aid
      "firstAid.title": "प्राथमिक चिकित्सा सहायक",
      "firstAid.subtitle": "चरणबद्ध आपातकालीन मार्गदर्शन प्राप्त करें",
      
      // Hospitals
      "hospitals.title": "नजदीकी अस्पताल खोजें",
      "hospitals.subtitle": "वास्तविक समय की जानकारी के साथ आपके पास चिकित्सा सुविधाएं खोजें",
      "hospitals.search": "अस्पताल, सेवाएं, या स्थान खोजें...",
      "hospitals.filterBy": "द्वारा फ़िल्टर करें:",
      "hospitals.allTypes": "सभी प्रकार",
      "hospitals.general": "सामान्य अस्पताल",
      "hospitals.emergency": "केवल आपातकाल",
      "hospitals.urgentCare": "तत्काल देखभाल",
      "hospitals.specialty": "विशेषता देखभाल",
      "hospitals.emergencyOnly": "केवल आपातकालीन कक्ष",
      "hospitals.callHospital": "अस्पताल को कॉल करें",
      "hospitals.getDirections": "दिशा निर्देश प्राप्त करें",
      "hospitals.navigateFromLocation": "मेरे स्थान से नेविगेट करें",
      "hospitals.viewOnMaps": "Google Maps पर देखें",
      "hospitals.emergencyCall": "आपातकालीन कॉल",
      "hospitals.servicesAvailable": "उपलब्ध सेवाएं:",
      "hospitals.noHospitals": "कोई अस्पताल नहीं मिला",
      "hospitals.adjustCriteria": "अपने खोज मानदंड या स्थान को समायोजित करने का प्रयास करें",
      "hospitals.locationServices": "स्थान सेवाएं",
      "hospitals.enableLocation": "अधिक सटीक दूरी देखने के लिए स्थान सेवाएं सक्षम करें",
      "hospitals.currentLocation": "वर्तमान स्थान",
      "hospitals.enableLocationText": "तेज़ आपातकालीन प्रतिक्रिया के लिए स्थान साझाकरण सक्षम करें",
      "hospitals.enableLocationBtn": "स्थान सक्षम करें",
      "hospitals.liveLocation": "लाइव स्थान का उपयोग करें",
      "hospitals.stopLive": "लाइव बंद करें",
      "hospitals.locating": "स्थान निर्धारण...",
      "hospitals.openInMaps": "Google Maps में खोलें",
      "hospitals.hospitalsNearMe": "मेरे पास के अस्पताल",
      
      // SOS
      "sos.title": "आपातकालीन SOS",
      "sos.subtitle": "आपातकालीन संपर्क और सेवाओं तक त्वरित पहुंच",
      
      // Dashboard
      "dashboard.title": "स्वास्थ्य डैशबोर्ड",
      "dashboard.subtitle": "अपने स्वास्थ्य मेट्रिक्स और इतिहास को ट्रैक करें",
      
      // Language Switcher
      "language.select": "भाषा चुनें",
      "language.en": "English",
      "language.hi": "हिन्दी",
      "language.ta": "தமிழ்"
    }
  },
  ta: {
    translation: {
      // Navigation
      "nav.home": "முகப்பு",
      "nav.skinCheck": "தோல் பரிசோதனை",
      "nav.firstAid": "முதலுதவி",
      "nav.hospitals": "மருத்துவமனைகள்",
      "nav.sos": "SOS",
      "nav.dashboard": "டாஷ்போர்ட்",
      
      // Common
      "common.loading": "ஏற்றுகிறது...",
      "common.error": "பிழை",
      "common.retry": "மீண்டும் முயல்க",
      "common.cancel": "ரத்து செய்",
      "common.save": "சேமி",
      "common.delete": "நீக்கு",
      "common.edit": "திருத்து",
      "common.back": "திரும்பு",
      "common.next": "அடுத்து",
      "common.previous": "முந்தைய",
      "common.close": "மூடு",
      "common.ok": "சரி",
      "common.yes": "ஆம்",
      "common.no": "இல்லை",
      
      // Home page
      "home.title": "AI சுகாதார துணை",
      "home.subtitle": "AI ஆல் இயக்கப்படும் உங்கள் அறிவார்ந்த சுகாதார உதவியாளர்",
      "home.description": "உடனடி சுகாதார பகுப்பாய்வு, அவசர உதவி மற்றும் மருத்துவ வழிகாட்டுதலை ஒரே இடத்தில் பெறுங்கள். எங்கள் AI-இயக்கப்படும் கருவிகள் உங்கள் ஆரோக்கியத்தைப் பற்றி தகவலறிந்த முடிவுகளை எடுக்க உதவுகின்றன.",
      "home.getStarted": "தொடங்குங்கள்",
      "home.learnMore": "மேலும் அறிக",
      
      // Skin Check
      "skinCheck.title": "AI தோல் பகுப்பாய்வு",
      "skinCheck.subtitle": "உடனடி தோல் நிலை கண்டறிதலுக்கு புகைப்படத்தை பதிவேற்றவும் அல்லது நேரடி கேமராவைப் பயன்படுத்தவும்",
      "skinCheck.disclaimer": "⚠️ மருத்துவ மறுப்பு: இந்த கருவி பொதுவான தகவல்களை மட்டுமே வழங்குகிறது மற்றும் தொழில்முறை மருத்துவ ஆலோசனைக்கு மாற்றாக இல்லை.",
      "skinCheck.uploadTab": "புகைப்படம் பதிவேற்று",
      "skinCheck.liveTab": "நேரடி கேமரா",
      "skinCheck.uploadImage": "படத்தை பதிவேற்றவும்",
      "skinCheck.dragDrop": "ஒரு படத்தை இங்கே இழுத்து விடவும், அல்லது தேர்ந்தெடுக்க கிளிக் செய்யவும்",
      "skinCheck.analyzeSkin": "தோலை பகுப்பாய்வு செய்",
      "skinCheck.analyzing": "உங்கள் தோல் பகுப்பாய்வு செய்யப்படுகிறது...",
      "skinCheck.analysisComplete": "பகுப்பாய்வு முடிந்தது",
      "skinCheck.condition": "கண்டறியப்பட்ட நிலை",
      "skinCheck.confidence": "நம்பிக்கை",
      "skinCheck.recommendations": "பரிந்துரைகள்",
      "skinCheck.newAnalysis": "புதிய பகுப்பாய்வைத் தொடங்கு",
      
      // Live Camera
      "camera.title": "நேரடி தோல் பகுப்பாய்வு",
      "camera.subtitle": "உங்கள் கேமராவைப் பயன்படுத்தி நிகழ்நேர தோல் நிலை கண்டறிதல்",
      "camera.notActive": "கேமரா செயலில் இல்லை",
      "camera.clickToStart": "நேரடி பகுப்பாய்வைத் தொடங்க \"கேமராவைத் தொடங்கு\" என்பதை கிளிக் செய்யவும்",
      "camera.startCamera": "கேமராவைத் தொடங்கு",
      "camera.stopCamera": "கேமராவை நிறுத்து",
      "camera.analyzeNow": "இப்போது பகுப்பாய்வு செய்",
      "camera.autoAnalysis": "தானியங்கு பகுப்பாய்வு",
      "camera.stopAuto": "தானியங்கு நிறுத்து",
      "camera.analyzing": "பகுப்பாய்வு செய்கிறது...",
      "camera.liveDetection": "நேரடி கண்டறிதல்",
      "camera.currentAnalysis": "தற்போதைய பகுப்பாய்வு",
      "camera.analysisHistory": "பகுப்பாய்வு வரலாறு",
      "camera.recent": "உங்கள் நேரடி அமர்விலிருந்து சமீபத்திய கண்டறிதல்கள்",
      "camera.error": "கேமரா அணுகல் மறுக்கப்பட்டது அல்லது கிடைக்கவில்லை. தயவுசெய்து அனுமதிகளைச் சரிபார்க்கவும்.",
      
      // First Aid
      "firstAid.title": "முதலுதவி உதவியாளர்",
      "firstAid.subtitle": "படிப்படியான அவசர வழிகாட்டுதலைப் பெறுங்கள்",
      
      // Hospitals
      "hospitals.title": "அருகிலுள்ள மருத்துவமனைகளைக் கண்டறியவும்",
      "hospitals.subtitle": "நிகழ்நேர தகவலுடன் உங்களுக்கு அருகிலுள்ள மருத்துவ வசதிகளைக் கண்டுபிடிக்கவும்",
      "hospitals.search": "மருத்துவமனைகள், சேவைகள் அல்லது இடம் தேடுங்கள்...",
      "hospitals.filterBy": "இதன்மூலம் வடிகட்டவும்:",
      "hospitals.allTypes": "எல்லா வகைகளும்",
      "hospitals.general": "பொது மருத்துவமனை",
      "hospitals.emergency": "அவசர நேரம் மட்டும்",
      "hospitals.urgentCare": "அவசர பராமரிப்பு",
      "hospitals.specialty": "சிறப்பு பராமரிப்பு",
      "hospitals.emergencyOnly": "அவசர அறை மட்டும்",
      "hospitals.callHospital": "மருத்துவமனையை அழைக்கவும்",
      "hospitals.getDirections": "வழிகளைப் பெறுங்கள்",
      "hospitals.navigateFromLocation": "என் இடத்திலிருந்து செல்லவும்",
      "hospitals.viewOnMaps": "Google Maps இல் காண்க",
      "hospitals.emergencyCall": "அவசர அழைப்பு",
      "hospitals.servicesAvailable": "கிடைக்கும் சேவைகள்:",
      "hospitals.noHospitals": "மருத்துவமனைகள் கிடைக்கவில்லை",
      "hospitals.adjustCriteria": "உங்கள் தேடல் அளவுகோல்கள் அல்லது இடத்தை சரிசெய்ய முயற்சிக்கவும்",
      "hospitals.locationServices": "இடச் சேவைகள்",
      "hospitals.enableLocation": "அதிக துல்லியமான தூரங்களைப் பார்க்க இடச் சேவைகளை இயக்கவும்",
      "hospitals.currentLocation": "தற்போதைய இடம்",
      "hospitals.enableLocationText": "வேகமான அவசர பதிலுக்காக இடம் பகிர்வை இயக்கவும்",
      "hospitals.enableLocationBtn": "இடத்தை இயக்கவும்",
      "hospitals.liveLocation": "நேரடி இடத்தைப் பயன்படுத்தவும்",
      "hospitals.stopLive": "நேரடியை நிறுத்து",
      "hospitals.locating": "இடம் கண்டறிகிறது...",
      "hospitals.openInMaps": "Google Maps இல் திறக்கவும்",
      "hospitals.hospitalsNearMe": "எனக்கு அருகிலுள்ள மருத்துவமனைகள்",
      
      // SOS
      "sos.title": "அவசர SOS",
      "sos.subtitle": "அவசர தொடர்புகள் மற்றும் சேவைகளுக்கு விரைவான அணுகல்",
      
      // Dashboard
      "dashboard.title": "சுகாதார டாஷ்போர்ட்",
      "dashboard.subtitle": "உங்கள் சுகாதார அளவீடுகள் மற்றும் வரலாற்றைக் கண்காணிக்கவும்",
      
      // Language Switcher
      "language.select": "மொழியைத் தேர்ந்தெடுக்கவும்",
      "language.en": "English",
      "language.hi": "हिन्दी",
      "language.ta": "தமிழ்"
    }
  }
};

const initPromise = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
  });

export { initPromise };

export default i18n;