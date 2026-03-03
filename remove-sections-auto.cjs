const fs = require('fs');

const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove Portfolio component usage
content = content.replace(/<Portfolio \/>\r?\n\s*/g, '');

// Remove Testimonials component usage
content = content.replace(/<Testimonials \/>\r?\n\s*/g, '');

// Remove Portfolio link in footer
content = content.replace(/\s*<li>\s*<a\s*href="#portfolio"\s*className="hover:text-foreground transition-colors"\s*>\s*Portfolio\s*<\/a>\s*<\/li>/g, '');

// Remove Portfolio component definition
const portfolioRegex = /const Portfolio = \(\) => \{[\s\S]*?^};(?:\r?\n)*/m;
content = content.replace(portfolioRegex, '');

// Remove Testimonials component definition
const testimonialsRegex = /const Testimonials = \(\) => \{[\s\S]*?^};(?:\r?\n)*/m;
content = content.replace(testimonialsRegex, '');

fs.writeFileSync(file, content);
console.log('Removed Portfolio and Testimonials from App.tsx');
