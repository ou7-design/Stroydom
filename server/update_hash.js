import fs from 'fs';
import bcrypt from 'bcryptjs';
import path from 'path';

const envPath = './.env';
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    const regex = /^ADMIN_PASSWORD_HASH=.*$/m;
    if (regex.test(content)) {
        content = content.replace(regex, `ADMIN_PASSWORD_HASH=${hash}`);
        fs.writeFileSync(envPath, content);
        console.log('Successfully updated ADMIN_PASSWORD_HASH in .env');
        console.log('New hash length:', hash.length);
    } else {
        console.error('Could not find ADMIN_PASSWORD_HASH in .env');
    }
} else {
    console.error('.env file not found at', envPath);
}
