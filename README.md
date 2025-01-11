# Dự án web liệt sĩ

## Cài đặt
```bash
npm i
```

## Chạy development
```bash
npx vite --host
```
--host giúp expose ra port trong LAN

## SSL Setup
1. Tạo thư mục SSL:
```bash
mkdir ssl
```

2. Copy SSL certificate files vào thư mục ssl:
- ssl.crt - SSL certificate file
- ssl.key - SSL private key file

3. Build và chạy Docker:
```bash
# Build image
docker build -t cemetry-frontend .

# Run container
docker run -d -p 80:80 -p 443:443 cemetry-frontend
```

## Ports
- HTTP: 80 (auto redirect to HTTPS)
- HTTPS: 443
