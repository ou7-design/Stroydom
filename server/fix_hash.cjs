const fs = require('fs');
const bcrypt = require('bcryptjs');

const envPath = './.env';
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Generated hash:', hash);
console.log('Comparing immediately:', bcrypt.compareSync(password, hash));

if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    const regex = /^ADMIN_PASSWORD_HASH=.*$/m;
    if (regex.test(content)) {
        content = content.replace(regex, `ADMIN_PASSWORD_HASH=${hash}`);
        fs.writeFileSync(envPath, content);
        console.log('Successfully updated .env');
    } else {
        // If not found, append it
        content += `\nADMIN_PASSWORD_HASH=${hash}\n`;
        fs.writeFileSync(envPath, content);
        console.log('Added ADMIN_PASSWORD_HASH to .env');
    }
} else {
    fs.writeFileSync(envPath, `ADMIN_PASSWORD_HASH=${hash}\n`);
    console.log('Created new .env with ADMIN_PASSWORD_HASH');
}
