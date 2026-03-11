# 🚀 Deployment Guide - Hướng Dẫn Triển Khai

## Triển Khai Môi Trường Development

Đã được giải thích trong README.md và QUICK_START.md.

---

## Triển Khai Môi Trường Production

### Prerequisites

- Server với OS (Linux, Windows Server, hoặc macOS)
- Node.js 14.x+ stabe
- MySQL Server 5.7 trở lên
- SSH access (nếu triển khai từ xa)
- Git (tùy chọn)
- PM2 hoặc supervisor (để run background)

### Bước 1: Chuẩn Bị Server

#### Trên Linux Server:

```bash
# Update packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt-get install -y mysql-server

# Install PM2 globally
sudo npm install -g pm2

# Verify installations
node --version
npm --version
mysql --version
pm2 --version
```

#### Trên Windows Server:

1. Download Node.js từ https://nodejs.org/
2. Install MySQL từ https://dev.mysql.com/downloads/mysql/
3. Install Git Bash (tùy chọn)
4. Open PowerShell/CMD as Admin

```powershell
# Install PM2 globally
npm install -g pm2

# Verify
node --version
npm --version
```

### Bước 2: Clone/Upload Project

#### Option A: Using Git

```bash
cd /var/www    # Linux
# hoặc C:\apps  # Windows

git clone https://github.com/your-repo/employee-management.git
cd employee-management
npm install
```

#### Option B: Upload Files

1. Upload project files to server (using FTP, SCP, hoặc cloud storage)
2. Extract if needed
3. Install dependencies:

```bash
cd employee-management
npm install --production  # Chỉ install production dependencies
```

### Bước 3: Database Setup

```bash
# Local database (đã setup sẵn)
mysql -u root -p < database/schema.sql

# Or remote database
mysql -h db.host.com -u username -p < database/schema.sql
```

### Bước 4: Configure Environment

Tạo file `.env` cho production:

```env
# Production Configuration
DB_HOST=db.example.com        # Hoặc localhost
DB_USER=prod_user
DB_PASSWORD=SecurePassword123!
DB_NAME=employee_management_prod
DB_PORT=3306

SERVER_PORT=3001
NODE_ENV=production

# Optional: Cache settings
CACHE_ENABLED=true
CACHE_TTL=3600
```

**Bảo mật:**
- Đừng commits `.env` file
- Sử dụng strong password
- Hạn chế DB user privileges

### Bước 5: Start Server

#### Using PM2 (Recommended)

```bash
# Start with PM2
pm2 start backend/server.js --name "employee-mgmt"

# Set auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs employee-mgmt

# Stop
pm2 stop employee-mgmt

# Restart
pm2 restart employee-mgmt
```

#### Using Supervisor (Linux)

Create `/etc/supervisor/conf.d/employee-management.conf`:

```ini
[program:employee-management]
directory=/var/www/employee-management
command=/usr/bin/node backend/server.js
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/employee-management.log
environment=NODE_ENV=production,PATH="/usr/local/bin:/usr/bin:/bin"
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start employee-management
```

#### Using Windows Service

```powershell
# Install NSSM (Non-Sucking Service Manager)
# Download from https://nssm.cc/download

nssm install EmployeeManagement C:\apps\employee-management\backend\server.js
nssm start EmployeeManagement
```

### Bước 6: Configure Web Server

#### Using Nginx (Linux)

Create `/etc/nginx/sites-available/employee-management`:

```nginx
upstream employee_app {
    server localhost:3001;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy settings
    location / {
        proxy_pass http://employee_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files
    location /css/ {
        alias /var/www/employee-management/frontend/css/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /js/ {
        alias /var/www/employee-management/frontend/js/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/employee-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Using Apache

Create `.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [QSA,L]
</IfModule>

# Proxy to Node.js
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
</IfModule>
```

### Bước 7: SSL/HTTPS Configuration

#### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Bước 8: Backup Strategy

#### Automated Database Backup

Create `/home/backup/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="employee_management_prod"

mkdir -p $BACKUP_DIR

# MySQL backup
mysqldump -u root -p$MYSQL_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove old backups (keep 7 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

Add to crontab (daily at 2 AM):

```bash
crontab -e

# Add:
0 2 * * * /bin/bash /home/backup/backup.sh >> /var/log/backup.log 2>&1
```

### Bước 9: Monitoring & Logging

#### PM2 Monitoring

```bash
# Install PM2 Monitoring
pm2 install pm2-logrotate

# Monitor CPU & Memory
pm2 monit

# Web dashboard
pm2 web
# Access at http://localhost:9615
```

#### Application Logging

Update `backend/server.js` để thêm logging:

```javascript
const fs = require('fs');
const logStream = fs.createWriteStream('app.log', { flags: 'a' });

app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.path}`);
    logStream.write(`[${now}] ${req.method} ${req.path}\n`);
    next();
});
```

### Bước 10: Performance Optimization

#### Enable Caching

```javascript
// Add to server.js
const compression = require('compression');
app.use(compression());

// Cache headers
app.use((req, res, next) => {
    if (req.path.endsWith('.css') || req.path.endsWith('.js')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
});
```

#### Database Connection Pool

File ready with mysql2 connection pooling.

#### Load Balancing (Multi-server)

Use Nginx as load balancer:

```nginx
upstream employee_nodes {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    listen 80;
    location / {
        proxy_pass http://employee_nodes;
    }
}
```

---

## Monitoring & Maintenance

### Health Check

```bash
curl https://your-domain.com/api/health
```

### Regular Updates

```bash
# Check for security updates
npm audit

# Update packages
npm update

# Update Node.js
# (Use nvm for safe version management)
```

### Database Maintenance

```bash
# Optimize tables
mysql> OPTIMIZE TABLE employees, departments;

# Check for errors
mysql> CHECK TABLE employees, departments;

# Repair if needed
mysql> REPAIR TABLE employees, departments;
```

---

## Troubleshooting Production

### "Connection refused"
```bash
# Check if server running
pm2 status

# Check port in use
netstat -tuln | grep 3001

# Check logs
pm2 logs employee-mgmt
```

### "Database connection error"
```bash
# Test MySQL connection
mysql -h db.host.com -u user -p

# Check MySQL is running
sudo systemctl status mysql

# Check permissions
mysql -u root -e "SELECT USER FROM mysql.user;"
```

### "Memory leak"
```bash
# Check memory usage
pm2 monit

# Restart if needed
pm2 restart employee-mgmt

# Check for dead connections
netstat -an | grep CLOSE_WAIT
```

### Performance slow
```bash
# Check CPU usage
top

# Check disk space
df -h

# Optimize database
mysql -u root -p < database/optimize.sql
```

---

## Security Checklist

- [ ] Change default MySQL password
- [ ] Use HTTPS/SSL
- [ ] Set strong Node.js password hash
- [ ] Enable firewall
- [ ] Whitelist IPs if needed
- [ ] Disable root SSH login
- [ ] Update all packages regularly
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity
- [ ] Use environment variables for secrets
- [ ] Keep Node.js and dependencies updated

---

## Checklist Triển Khai

### Pre-deployment
- [ ] Code review completed
- [ ] All tests passed
- [ ] Documentation updated
- [ ] Backup strategy configured
- [ ] Monitoring tools installed
- [ ] SSL certificate obtained

### Deployment Day
- [ ] Clone/upload code
- [ ] Install dependencies
- [ ] Create database
- [ ] Configure .env
- [ ] Start server
- [ ] Test all endpoints
- [ ] Verify SSL
- [ ] Setup backups
- [ ] Enable monitoring

### Post-deployment
- [ ] Monitor logs
- [ ] Check performance metrics
- [ ] Notify users
- [ ] Document deployment
- [ ] Plan maintenance windows

---

**Deployed successfully! 🎉**

---

**Last Updated**: March 10, 2026
