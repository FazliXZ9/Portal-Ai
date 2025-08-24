# ==================================
#   STAGE 1: Build Aplikasi
# ==================================
# Kita pakai image Node.js versi 18 yang ringan (alpine) sebagai dasar
FROM node:18-alpine AS builder

# Set direktori kerja di dalam image
WORKDIR /app

# Copy file package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan cache Docker, jadi 'npm install' tidak akan dijalankan ulang jika file ini tidak berubah
COPY package*.json ./

# Install semua dependency
RUN npm install

# Copy semua sisa source code aplikasi
COPY . .

# Build aplikasi Next.js untuk production
# Pastikan script "build" ada di package.json Anda
RUN npm run build

# ==================================
#   STAGE 2: Production Image
# ==================================
# Kita mulai lagi dari image Node.js yang bersih dan ringan untuk hasil akhir
FROM node:18-alpine AS runner
WORKDIR /app

# Buat user non-root untuk keamanan (best practice)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy hasil build dari STAGE 1 (builder)
# Hanya copy file yang benar-benar dibutuhkan untuk production
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Ganti ke user non-root yang sudah dibuat
USER nextjs

# Expose port yang digunakan Next.js (default: 3000)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container start
CMD ["npm", "start"]