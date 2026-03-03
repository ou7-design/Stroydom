const fs = require('fs');
const file = 'src/App.tsx';

let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('ContactPage')) {
  content = content.replace(
    'import { Header } from "@/components/ui/header-1";',
    'import { Header } from "@/components/ui/header-1";\nimport { ContactPage } from "@/components/ui/contact-page";'
  );
}

// Remove Footer component
const footerRegex = /const Footer = \(\) => \{[\s\S]*?^};(?:\r?\n)*/m;
content = content.replace(footerRegex, '');

// Replace <Footer /> with <ContactPage />
content = content.replace(/<Footer \/>/g, '<ContactPage />');

fs.writeFileSync(file, content);
console.log('Successfully replaced Footer with ContactPage');
