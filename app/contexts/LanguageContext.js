"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchData } from '../services/firebase';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Available languages
export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', code: 'en' },
  es: { name: 'Español', flag: '🇪🇸', code: 'es' },
  fr: { name: 'Français', flag: '🇫🇷', code: 'fr' },
  de: { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
  it: { name: 'Italiano', flag: '🇮🇹', code: 'it' },
  pt: { name: 'Português', flag: '🇵🇹', code: 'pt' },
  ru: { name: 'Русский', flag: '🇷🇺', code: 'ru' },
  zh: { name: '中文', flag: '🇨🇳', code: 'zh' },
  ja: { name: '日本語', flag: '🇯🇵', code: 'ja' },
  ko: { name: '한국어', flag: '🇰🇷', code: 'ko' },
  ar: { name: 'العربية', flag: '🇸🇦', code: 'ar' },
};

// Translation files
const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    thoughts: 'Thoughts',
    contact: 'Contact',
    admin: 'Admin',
    
    // Hero Section
    hero: {
      title: 'Full Stack Developer',
      subtitle: 'Building the future with code',
      description: 'Passionate about creating innovative solutions and bringing ideas to life through technology.',
      github: 'View GitHub',
      linkedin: 'Connect',
      resume: 'View Resume',
      download: 'Download PDF',
      status: 'Available for opportunities',
      languages: 'Languages I Speak'
    },
    
    // About Section
    about: {
      title: 'About Me',
      subtitle: 'Full Stack & AI Engineer',
      rolesHeld: 'Roles Held',
      activeProjects: 'Active Projects',
      profileVisits: 'Profile Visits',
      techStack: 'Tech Stack',
      workExperience: 'Work Experience',
      educationLabel: 'Education',
      languagesLabel: 'Languages & Fun',
      striker: 'Best Striker ⚽️',
      strikerDesc: 'Earned on the local pitch',
      achievementsLabel: 'Achievements & Highlights',
      experience: 'Experience',
      education: 'Education',
      extracurricularAndAchievement: 'Extracurricular and Achievement',
      programming: 'Programming',
      skills: 'Skills',
      aiTools: 'AI Tools',
      relevantCoursework: 'Relevant Coursework',
      academicExcellence: 'Academic Excellence',
      knowledgeGrowth: 'Knowledge Growth',
      skillDevelopment: 'Skill Development',
      noEducation: 'No Education Added Yet',
      noEducationDesc: 'Add your educational background in the admin panel to showcase your academic achievements!',
      noSkills: 'No Skills Yet',
      noSkillsDesc: 'Add your skills in the admin panel to showcase your expertise!',
      noExtracurricularAndAchievement: 'No Extracurricular and Achievement Yet',
      noExtracurricularAndAchievementDesc: 'Add your extracurricular activities and achievements in the admin panel to showcase your accomplishments!',
      noProgramming: 'No Programming Languages Yet',
      noProgrammingDesc: 'Add your programming languages and proficiency levels in the admin panel!',
      noAITools: 'No AI Tools Yet',
      noAIToolsDesc: 'Add your AI tools and technologies in the admin panel to showcase your AI expertise!'
    },
    
    // Projects Section
    projects: {
      title: 'My Projects',
      viewProject: 'View Project',
      viewCode: 'View Code',
      noProjects: 'No Projects Yet',
      noProjectsDesc: 'Add your projects in the admin panel to showcase your work!'
    },
    
    // Contact Section
    contact: {
      title: 'Get In Touch',
      subtitle: 'Let\'s work together to bring your ideas to life',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.'
    },
    
    // Footer
    footer: {
      rights: 'All rights reserved.',
      built: 'Built with Next.js and Tailwind CSS'
    }
  },
  
  es: {
    // Navegación
    home: 'Inicio',
    about: 'Acerca de',
    projects: 'Proyectos',
    thoughts: 'Pensamientos',
    contact: 'Contacto',
    admin: 'Admin',
    
    // Sección Hero
    hero: {
      title: 'Desarrollador Full Stack',
      subtitle: 'Construyendo el futuro con código',
      description: 'Apasionado por crear soluciones innovadoras y dar vida a las ideas a través de la tecnología.',
      github: 'Ver GitHub',
      linkedin: 'Conectar',
      resume: 'Ver Currículum',
      download: 'Descargar PDF',
      status: 'Disponible para oportunidades',
      languages: 'Idiomas que Hablo'
    },
    
    // Sección Acerca de
    about: {
      title: 'Acerca de Mí',
      subtitle: 'Ingeniero Full Stack y de IA',
      rolesHeld: 'Roles Desempeñados',
      activeProjects: 'Proyectos Activos',
      profileVisits: 'Visitas al Perfil',
      techStack: 'Tecnologías',
      workExperience: 'Experiencia Laboral',
      educationLabel: 'Educación',
      languagesLabel: 'Idiomas y Diversión',
      striker: 'Mejor Delantero ⚽️',
      strikerDesc: 'Ganado en el campo local',
      achievementsLabel: 'Logros y Destacados',
      experience: 'Experiencia',
      education: 'Educación',
      extracurricularAndAchievement: 'Extracurriculares y Logros',
      programming: 'Programación',
      skills: 'Habilidades',
      aiTools: 'Herramientas IA',
      relevantCoursework: 'Cursos Relevantes',
      academicExcellence: 'Excelencia Académica',
      knowledgeGrowth: 'Crecimiento del Conocimiento',
      skillDevelopment: 'Desarrollo de Habilidades',
      noEducation: 'Aún No Hay Educación Agregada',
      noEducationDesc: '¡Agrega tu formación académica en el panel de administración para mostrar tus logros académicos!',
      noSkills: 'Aún No Hay Habilidades',
      noSkillsDesc: '¡Agrega tus habilidades en el panel de administración para mostrar tu experiencia!',
      noExtracurricularAndAchievement: 'Aún No Hay Extracurriculares y Logros',
      noExtracurricularAndAchievementDesc: '¡Agrega tus actividades extracurriculares y logros en el panel de administración para mostrar tus éxitos!',
      noProgramming: 'Aún No Hay Lenguajes de Programación',
      noProgrammingDesc: '¡Agrega tus lenguajes de programación y niveles de competencia en el panel de administración!',
      noAITools: 'Aún No Hay Herramientas IA',
      noAIToolsDesc: '¡Agrega tus herramientas y tecnologías de IA en el panel de administración para mostrar tu experiencia en IA!'
    },
    
    // Sección Proyectos
    projects: {
      title: 'Mis Proyectos',
      viewProject: 'Ver Proyecto',
      viewCode: 'Ver Código',
      noProjects: 'Aún No Hay Proyectos',
      noProjectsDesc: '¡Agrega tus proyectos en el panel de administración para mostrar tu trabajo!'
    },
    
    // Sección Contacto
    contact: {
      title: 'Ponte en Contacto',
      subtitle: 'Trabajemos juntos para dar vida a tus ideas',
      name: 'Nombre',
      email: 'Correo',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      success: '¡Mensaje enviado exitosamente!',
      error: 'Error al enviar mensaje. Por favor, inténtalo de nuevo.'
    },
    
    // Pie de página
    footer: {
      rights: 'Todos los derechos reservados.',
      built: 'Construido con Next.js y Tailwind CSS'
    }
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    projects: 'Projets',
    thoughts: 'Pensées',
    contact: 'Contact',
    admin: 'Admin',
    
    // Section Hero
    hero: {
      title: 'Développeur Full Stack',
      subtitle: 'Construire l\'avenir avec du code',
      description: 'Passionné par la création de solutions innovantes et donner vie aux idées grâce à la technologie.',
      github: 'Voir GitHub',
      linkedin: 'Se connecter',
      resume: 'Voir le CV',
      download: 'Télécharger le PDF',
      status: 'Disponible pour des opportunités',
      languages: 'Langues que je Parle'
    },
    
    // Section À propos
    about: {
      title: 'À propos de Moi',
      subtitle: 'Ingénieur Full Stack & IA',
      rolesHeld: 'Postes Occupés',
      activeProjects: 'Projets Actifs',
      profileVisits: 'Visites de Profil',
      techStack: 'Tech Stack',
      workExperience: 'Expérience Professionnelle',
      educationLabel: 'Éducation',
      languagesLabel: 'Langues & Fun',
      striker: 'Meilleur Buteur ⚽️',
      strikerDesc: 'Gagné sur le terrain local',
      achievementsLabel: 'Réalisations & Points Forts',
      experience: 'Expérience',
      education: 'Éducation',
      extracurricularAndAchievement: 'Extracurriculaires et Réalisations',
      programming: 'Programmation',
      skills: 'Compétences',
      aiTools: 'Outils IA',
      relevantCoursework: 'Cours Pertinents',
      academicExcellence: 'Excellence Académique',
      knowledgeGrowth: 'Croissance des Connaissances',
      skillDevelopment: 'Développement des Compétences',
      noEducation: 'Aucune Éducation Ajoutée',
      noEducationDesc: 'Ajoutez votre formation académique dans le panneau d\'administration pour présenter vos réalisations académiques !',
      noSkills: 'Aucune Compétence',
      noSkillsDesc: 'Ajoutez vos compétences dans le panneau d\'administration pour présenter votre expertise !',
      noExtracurricularAndAchievement: 'Aucune Activité Extracurriculaire et Réalisation',
      noExtracurricularAndAchievementDesc: 'Ajoutez vos activités extracurriculaires et réalisations dans le panneau d\'administration pour présenter vos succès !',
      noProgramming: 'Aucun Langage de Programmation',
      noProgrammingDesc: 'Ajoutez vos langages de programmation et niveaux de compétence dans le panneau d\'administration !',
      noAITools: 'Aucun Outil IA',
      noAIToolsDesc: 'Ajoutez vos outils et technologies d\'IA dans le panneau d\'administration pour présenter votre expertise en IA !'
    },
    
    // Section Projets
    projects: {
      title: 'Mes Projets',
      viewProject: 'Voir le Projet',
      viewCode: 'Voir le Code',
      noProjects: 'Aucun Projet',
      noProjectsDesc: 'Ajoutez vos projets dans le panneau d\'administration pour présenter votre travail !'
    },
    
    // Section Contact
    contact: {
      title: 'Entrer en Contact',
      subtitle: 'Travaillons ensemble pour donner vie à vos idées',
      name: 'Nom',
      email: 'Email',
      message: 'Message',
      send: 'Envoyer le Message',
      sending: 'Envoi en cours...',
      success: 'Message envoyé avec succès !',
      error: 'Échec de l\'envoi du message. Veuillez réessayer.'
    },
    
    // Pied de page
    footer: {
      rights: 'Tous droits réservés.',
      built: 'Construit avec Next.js et Tailwind CSS'
    }
  },

  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'من أنا',
    projects: 'مشاريعي',
    thoughts: 'أفكاري',
    contact: 'اتصل بي',
    admin: 'المشرف',
    
    // Hero Section
    hero: {
      title: 'مطور ويب متكامل',
      subtitle: 'بناء المستقبل بالبرمجة',
      description: 'شغوف بابتكار الحلول البرمجية وتحويل الأفكار إلى واقع ملموس من خلال التكنولوجيا.',
      github: 'عرض جيت هاب',
      linkedin: 'اتصال',
      resume: 'عرض السيرة الذاتية',
      download: 'تحميل PDF',
      status: 'متاح لفرص العمل',
      languages: 'اللغات التي أتحدثها'
    },
    
    // About Section
    about: {
      title: 'من أنا',
      subtitle: 'مهندس مطور متكامل وذكاء اصطناعي',
      rolesHeld: 'المناصب والمهام',
      activeProjects: 'المشاريع النشطة',
      profileVisits: 'زيارات الملف الشخصي',
      techStack: 'التقنيات المستخدمة',
      workExperience: 'الخبرة المهنية',
      educationLabel: 'التعليم والشهادات',
      languagesLabel: 'اللغات والترفيه',
      striker: 'أفضل مهاجم ⚽️',
      strikerDesc: 'تم الحصول عليها في الملعب المحلي',
      achievementsLabel: 'الإنجازات والنجاحات',
      experience: 'الخبرة',
      education: 'التعليم',
      extracurricularAndAchievement: 'الأنشطة الإضافية والإنجازات',
      programming: 'البرمجة',
      skills: 'المهارات',
      aiTools: 'أدوات الذكاء الاصطناعي',
      relevantCoursework: 'المقررات ذات الصلة',
      academicExcellence: 'التميز الأكاديمي',
      knowledgeGrowth: 'نمو المعرفة',
      skillDevelopment: 'تطوير المهارات',
      noEducation: 'لم يتم إضافة تعليم بعد',
      noEducationDesc: 'أضف تعليمك في لوحة التحكم لعرض إنجازاتك الأكاديمية!',
      noSkills: 'لا توجد مهارات بعد',
      noSkillsDesc: 'أضف مهاراتك في لوحة التحكم لعرض خبرتك!',
      noExtracurricularAndAchievement: 'لا توجد أنشطة إضافية أو إنجازات بعد',
      noExtracurricularAndAchievementDesc: 'أضف أنشطتك وإنجازاتك في لوحة التحكم لعرض نجاحاتك!',
      noProgramming: 'لا توجد لغات برمجة بعد',
      noProgrammingDesc: 'أضف لغات البرمجة ومستويات الكفاءة في لوحة التحكم!',
      noAITools: 'لا توجد أدوات ذكاء اصطناعي بعد',
      noAIToolsDesc: 'أضف أدوات الذكاء الاصطناعي في لوحة التحكم لعرض خبراتك!'
    },
    
    // Projects Section
    projects: {
      title: 'مشاريعي',
      viewProject: 'عرض المشروع',
      viewCode: 'عرض الكود',
      noProjects: 'لا توجد مشاريع بعد',
      noProjectsDesc: 'أضف مشاريعك في لوحة التحكم لعرض أعمالك!'
    },
    
    // Contact Section
    contact: {
      title: 'اتصل بي',
      subtitle: 'دعنا نعمل معاً لتحويل أفكارك إلى حقيقة',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      message: 'الرسالة',
      send: 'إرسال الرسالة',
      sending: 'جاري الإرسال...',
      success: 'تم إرسال الرسالة بنجاح!',
      error: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.'
    },
    
    // Footer
    footer: {
      rights: 'جميع الحقوق محفوظة.',
      built: 'تم البناء بواسطة Next.js و Tailwind CSS'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState(LANGUAGES);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        // Get language from localStorage or default to 'en'
        const savedLanguage = localStorage.getItem('website-language');
        
        // Fetch languages from backend
        const aboutData = await fetchData('about');
        if (aboutData?.languages && Array.isArray(aboutData.languages)) {
          // Convert backend languages to the format expected by the context
          const backendLanguages = {};
          aboutData.languages.forEach(lang => {
            if (lang.isActive) {
              backendLanguages[lang.code] = {
                name: lang.name,
                flag: lang.flag,
                code: lang.code
              };
            }
          });
          setAvailableLanguages(backendLanguages);
          
          // Set default language from backend
          const defaultLang = aboutData.languages.find(lang => lang.isDefault);
          if (defaultLang && backendLanguages[defaultLang.code]) {
            setLanguage(defaultLang.code);
          } else if (savedLanguage && backendLanguages[savedLanguage]) {
            setLanguage(savedLanguage);
          } else if (Object.keys(backendLanguages).length > 0) {
            setLanguage(Object.keys(backendLanguages)[0]);
          }
        } else if (savedLanguage && LANGUAGES[savedLanguage]) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading languages:', error);
        // Fallback to default languages
        const savedLanguage = localStorage.getItem('website-language');
        if (savedLanguage && LANGUAGES[savedLanguage]) {
          setLanguage(savedLanguage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguages();
  }, []);

  // Listen for language changes to toggle document RTL direction
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (availableLanguages[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('website-language', newLanguage);
    }
  };

  const t = (key, fallback = '') => {
    if (isLoading) return fallback || key;
    
    try {
      const keys = key.split('.');
      let value = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && value.hasOwnProperty(k)) {
          value = value[k];
        } else {
          return fallback || key;
        }
      }
      
      // Ensure we return a string, not an object
      if (typeof value === 'string') {
        return value;
      } else {
        return fallback || key;
      }
    } catch (error) {
      console.error('Translation error:', error);
      return fallback || key;
    }
  };

  const value = {
    language,
    changeLanguage,
    t,
    languages: availableLanguages,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
