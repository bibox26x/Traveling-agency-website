import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.join(process.cwd(), 'public/locales');
const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'];

interface TranslationDiff {
  missingKeys: string[];
  extraKeys: string[];
}

function getAllKeys(obj: any, prefix = ''): string[] {
  return Object.keys(obj).reduce((keys: string[], key: string) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return [...keys, ...getAllKeys(obj[key], newPrefix)];
    }
    return [...keys, newPrefix];
  }, []);
}

function compareTranslations(baseKeys: string[], compareKeys: string[]): TranslationDiff {
  return {
    missingKeys: baseKeys.filter(key => !compareKeys.includes(key)),
    extraKeys: compareKeys.filter(key => !baseKeys.includes(key))
  };
}

function validateTranslations() {
  try {
    // Read English translations as base
    const enTranslations = JSON.parse(
      fs.readFileSync(path.join(LOCALES_DIR, 'en/common.json'), 'utf8')
    );
    const enKeys = getAllKeys(enTranslations);

    // Compare with other languages
    SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').forEach(lang => {
      console.log(`\nValidating ${lang.toUpperCase()} translations:`);
      
      const langTranslations = JSON.parse(
        fs.readFileSync(path.join(LOCALES_DIR, `${lang}/common.json`), 'utf8')
      );
      const langKeys = getAllKeys(langTranslations);
      
      const diff = compareTranslations(enKeys, langKeys);
      
      if (diff.missingKeys.length > 0) {
        console.log('\nMissing keys:');
        diff.missingKeys.forEach(key => console.log(`- ${key}`));
      }
      
      if (diff.extraKeys.length > 0) {
        console.log('\nExtra keys:');
        diff.extraKeys.forEach(key => console.log(`- ${key}`));
      }
      
      if (diff.missingKeys.length === 0 && diff.extraKeys.length === 0) {
        console.log('✓ All translations are in sync');
      }
    });
  } catch (error) {
    console.error('Error validating translations:', error);
    process.exit(1);
  }
}

validateTranslations(); 