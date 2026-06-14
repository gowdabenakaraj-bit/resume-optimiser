/* OptiCV Intelligent client-side ATS Optimizer & Parsing Engine */

// Master dictionary of common industry keywords grouped by domain
const KEYWORD_DICT = {
  frontend: [
    'react', 'angular', 'vue', 'html5', 'css3', 'javascript', 'typescript', 'webpack', 
    'vite', 'next.js', 'redux', 'tailwind', 'bootstrap', 'sass', 'responsive design', 
    'ui/ux', 'flexbox', 'grid', 'web performance', 'seo', 'accessibility', 'babel'
  ],
  backend: [
    'node.js', 'express', 'django', 'flask', 'fastapi', 'spring boot', 'java', 'python', 
    'go', 'golang', 'ruby', 'rails', 'php', 'nestjs', 'graphql', 'rest api', 'apis', 
    'microservices', 'mvc', 'gRPC', 'middleware', 'oauth'
  ],
  database: [
    'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'cassandra', 'firebase', 
    'dynamodb', 'sql', 'nosql', 'prisma', 'mongoose', 'sequelize', 'indexing', 'query optimization'
  ],
  devops: [
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'github actions', 
    'terraform', 'ansible', 'linux', 'nginx', 'serverless', 'monitoring', 'git', 'gitlab'
  ],
  dataScience: [
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 
    'scikit-learn', 'nlp', 'computer vision', 'tableau', 'powerbi', 'data analytics', 
    'r', 'jupyter', 'data pipeline', 'regression', 'clustering'
  ],
  mobile: [
    'react native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'xcode', 'gradle'
  ],
  softSkills: [
    'agile', 'scrum', 'project management', 'communication', 'leadership', 'teamwork', 
    'problem solving', 'analytical', 'collaboration', 'critical thinking', 'time management'
  ]
};

// Strong action verbs for resumes
const ACTION_VERBS = [
  'designed', 'developed', 'implemented', 'led', 'managed', 'optimized', 'created', 
  'automated', 'collaborated', 'programmed', 'built', 'engineered', 'researched', 
  'analyzed', 'streamlined', 'coordinated', 'executed', 'formulated', 'spearheaded', 
  'mentored', 'established', 'upgraded', 'reduced', 'increased', 'maximized'
];

// Weak / passive phrases to discourage
const WEAK_PHRASES = [
  'responsible for', 'assisted with', 'helped to', 'duties included', 'worked on', 
  'part of a team', 'familiar with', 'participated in'
];

// Standard resume section headings to audit
const SECTIONS = {
  education: ['education', 'academic background', 'qualification', 'studies'],
  experience: ['experience', 'work history', 'professional background', 'employment', 'internships'],
  projects: ['projects', 'academic projects', 'personal projects', 'key projects'],
  skills: ['skills', 'technical skills', 'core competencies', 'expertise', 'technologies']
};

/**
 * Tokenizes text into lowercase words/phrases
 * @param {string} text 
 * @returns {Array<string>}
 */
function tokenize(text) {
  if (!text) return [];
  // Clean punctuation but keep dots/hyphens for tech terms (e.g. Next.js, CI/CD, Node.js)
  return text
    .toLowerCase()
    .replace(/[^\w\s\.\-\#\+]/g, ' ')
    .split(/\s+/)
    .filter(word => word.trim().length > 1);
}

/**
 * Normalizes text to search for multi-word keywords
 * @param {string} text 
 * @returns {string}
 */
function normalizeText(text) {
  return (text || '').toLowerCase();
}

/**
 * Extracts matched and missing keywords from Job Description vs Resume
 * @param {string} jdText 
 * @param {string} resumeText 
 */
function analyzeKeywords(jdText, resumeText) {
  const normalizedJD = normalizeText(jdText);
  const normalizedResume = normalizeText(resumeText);
  
  // Find which keywords from our dictionary are present in the Job Description
  const targetKeywords = [];
  Object.values(KEYWORD_DICT).flat().forEach(keyword => {
    if (normalizedJD.includes(keyword)) {
      targetKeywords.push(keyword);
    }
  });

  // If Job Description is short or generic, pull top 5 default tech words as backups
  if (targetKeywords.length < 3) {
    const backupKeywords = ['git', 'agile', 'communication', 'sql', 'collaboration'];
    backupKeywords.forEach(k => {
      if (!targetKeywords.includes(k)) targetKeywords.push(k);
    });
  }

  // Check which target keywords exist in the Resume
  const matched = [];
  const missing = [];

  targetKeywords.forEach(keyword => {
    if (normalizedResume.includes(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  return { matched, missing };
}

/**
 * Audits structure, action verbs, and readability
 * @param {string} resumeText 
 */
function auditResume(resumeText) {
  const normalized = normalizeText(resumeText);
  const audit = [];
  let formattingScore = 100;
  let impactScore = 100;
  let readabilityScore = 100;

  // 1. Section Headings Check
  let missingSectionsCount = 0;
  for (const [sectionKey, keywords] of Object.entries(SECTIONS)) {
    const found = keywords.some(keyword => normalized.includes(keyword));
    if (!found) {
      missingSectionsCount++;
      formattingScore -= 15;
      audit.push({
        type: 'danger',
        title: `Missing ${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)} Section`,
        desc: `Could not identify a clear "${sectionKey}" section in your resume. ATS algorithms rely on these headings to parse details correctly.`
      });
    } else {
      audit.push({
        type: 'success',
        title: `${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)} Section Found`,
        desc: `Your resume has a clearly labeled "${sectionKey}" area.`
      });
    }
  }

  // 2. Action Verbs vs Weak Phrases
  const words = tokenize(resumeText);
  let verbCount = 0;
  ACTION_VERBS.forEach(verb => {
    const occurrences = words.filter(w => w === verb).length;
    verbCount += occurrences;
  });

  let weakPhraseCount = 0;
  WEAK_PHRASES.forEach(phrase => {
    const occurrences = (normalized.match(new RegExp(phrase, 'g')) || []).length;
    weakPhraseCount += occurrences;
  });

  if (verbCount < 4) {
    impactScore -= 20;
    audit.push({
      type: 'warning',
      title: 'Increase Action Verbs',
      desc: `Found only ${verbCount} strong action verbs. Use impact-driven words like "Engineered", "Optimized", and "Spearheaded" at the start of bullet points.`
    });
  } else {
    audit.push({
      type: 'success',
      title: 'Strong Impact Verbs',
      desc: `Great job! Your resume uses ${verbCount} strong action verbs, showcasing active leadership and development.`
    });
  }

  if (weakPhraseCount > 2) {
    impactScore -= 15;
    audit.push({
      type: 'danger',
      title: 'Passive Phrases Found',
      desc: `Detected ${weakPhraseCount} passive phrases (e.g., "responsible for"). Rewrite these to sound achievement-oriented (e.g., "Accomplished X by doing Y").`
    });
  }

  // 3. Length & Contact Details Readability Check
  const wordCount = words.length;
  if (wordCount < 150) {
    readabilityScore -= 30;
    audit.push({
      type: 'danger',
      title: 'Resume is Too Short',
      desc: `Your resume is only ${wordCount} words. A standard resume should be between 300 to 600 words to provide enough details for the ATS.`
    });
  } else if (wordCount > 900) {
    readabilityScore -= 15;
    audit.push({
      type: 'warning',
      title: 'Resume is Too Long',
      desc: `Your resume is ${wordCount} words. For students/freshers, keeping the resume to a single page (approx 400-600 words) is highly recommended.`
    });
  } else {
    audit.push({
      type: 'success',
      title: 'Perfect Word Count',
      desc: `Your resume word count (${wordCount} words) is optimal for a professional 1-page layout.`
    });
  }

  // Contact Info Check
  const hasEmail = normalized.includes('@');
  const hasPhone = /\+?\d[\d-\s]{8,14}/.test(normalized);
  const hasLinkedIn = normalized.includes('linkedin.com');
  const hasGitHub = normalized.includes('github.com');

  if (!hasEmail) {
    formattingScore -= 10;
    audit.push({
      type: 'danger',
      title: 'Email Address Missing',
      desc: 'No valid email address was detected. Recruiter ATS systems will reject profiles without contact links.'
    });
  }
  if (!hasPhone) {
    formattingScore -= 10;
    audit.push({
      type: 'warning',
      title: 'Phone Number Missing',
      desc: 'Add a contact phone number so hiring teams can call you for interview schedules.'
    });
  }
  if (!hasLinkedIn && !hasGitHub) {
    readabilityScore -= 10;
    audit.push({
      type: 'warning',
      title: 'Online Profiles Missing',
      desc: 'Include links to your GitHub (for tech projects) or LinkedIn profiles to add credibility to your experience.'
    });
  } else {
    audit.push({
      type: 'success',
      title: 'Professional Profiles Listed',
      desc: 'Your resume contains active links to portfolios or professional directories.'
    });
  }

  return {
    audit,
    formattingScore: Math.max(10, formattingScore),
    impactScore: Math.max(10, impactScore),
    readabilityScore: Math.max(10, readabilityScore)
  };
}

/**
 * Run full ATS Analysis
 * @param {string} jdText 
 * @param {string} resumeText 
 */
export function analyzeResume(jdText, resumeText) {
  if (!jdText.trim() || !resumeText.trim()) {
    throw new Error('Please fill out both the Job Description and Resume content.');
  }

  // 1. Analyze Keywords
  const keywords = analyzeKeywords(jdText, resumeText);
  const totalKeywords = keywords.matched.length + keywords.missing.length;
  const keywordScore = totalKeywords > 0 
    ? Math.round((keywords.matched.length / totalKeywords) * 100) 
    : 70;

  // 2. Audit Structure & Copywriting
  const { audit, formattingScore, impactScore, readabilityScore } = auditResume(resumeText);

  // 3. Calculate Final Composite Score
  // Weights: Keyword Match (40%), Formatting (25%), Impact (20%), Readability (15%)
  const finalScore = Math.round(
    (keywordScore * 0.40) + 
    (formattingScore * 0.25) + 
    (impactScore * 0.20) + 
    (readabilityScore * 0.15)
  );

  return {
    score: finalScore,
    report: {
      keywordScore,
      formattingScore,
      impactScore,
      readabilityScore,
      keywords,
      audit
    }
  };
}
