# ⚡ QUICK SECURITY CHECK - 5 Phút

## 🔴 CRITICAL - Kiểm tra NGAY

### 1. Kiểm tra Next.js Version (30 giây)

```bash
cd frontend
npm list next
```

**Nếu thấy:**
- `next@16.0.0` đến `16.0.6` → ❌ **VULNERABLE** - Update ngay!
- `next@16.0.7+` → ✅ **SAFE**

**Fix:**
```bash
npm install next@16.0.7 react@19.2.1 react-dom@19.2.1
npm run build
```

### 2. Kiểm tra Malware (1 phút)

```bash
# Check crypto miners
ps aux | grep -E "xmrig|miner|crypto" | grep -v grep

# Check malicious files
ls -la /tmp/sex.sh /tmp/slt 2>/dev/null

# Check suspicious cron jobs
crontab -l | grep -v "^#"
```

**Nếu có kết quả:** → 🔴 **BỊ HACK RỒI!** Follow `EMERGENCY_CHECKLIST.md`

### 3. Kiểm tra Security Headers (30 giây)

```bash
# Check next.config.ts
grep -A 20 "async headers" frontend/next.config.ts
```

**Nếu không có:** → 🟡 **THIẾU** - Xem `SECURITY_AUDIT_REPORT.md` section 2

### 4. Kiểm tra Rate Limiting (30 giây)

```bash
# Check middleware.ts
grep -i "rate" frontend/middleware.ts
```

**Nếu không có:** → 🟡 **THIẾU** - Xem `SECURITY_AUDIT_REPORT.md` section 3

### 5. Kiểm tra Database Config (1 phút)

```bash
# Check database.ts
grep "host:" backend/src/config/database.ts

# Should show: host: process.env.DB_HOST || 'localhost'
```

**Nếu thấy IP public hoặc không phải localhost:** → 🔴 **NGUY HIỂM**

---

## ✅ CHECKLIST NHANH

- [ ] Next.js version >= 16.0.7
- [ ] React version >= 19.2.1
- [ ] Không có malware processes
- [ ] Không có malicious files
- [ ] Security headers đã được config
- [ ] Rate limiting đã được implement
- [ ] Database chỉ listen localhost
- [ ] .env files không commit vào git

---

## 🚨 NẾU PHÁT HIỆN VẤN ĐỀ

1. **CVE-2025-55182:** Update ngay (xem section 1)
2. **Malware:** Follow `EMERGENCY_CHECKLIST.md`
3. **Thiếu security:** Xem `SECURITY_AUDIT_REPORT.md` để fix

---

**Xem báo cáo đầy đủ:** `SECURITY_AUDIT_REPORT.md`

