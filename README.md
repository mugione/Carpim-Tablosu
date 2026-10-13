<div align="center">

<img src="public/icon-512.png" alt="Çarpım Tablosu Macerası" width="128" height="128" />

# 🎯 Çarpım Tablosu Macerası ✖️

**Çocuklar için sesli, puanlı, mobil uyumlu çarpım tablosu öğrenme oyunu.**

[![Canlı Demo](https://img.shields.io/badge/🌐_Canlı_Demo-Aç-4f46e5?style=for-the-badge)](https://carpim-tablosu.mlakin.workers.dev)

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![D1](https://img.shields.io/badge/Cloudflare-D1-F38020?logo=cloudflare&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Yüklenebilir-5A0FC8?logo=pwa&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![ElevenLabs](https://img.shields.io/badge/Ses-ElevenLabs_v3-000000?logo=elevenlabs&logoColor=white)
![No Build](https://img.shields.io/badge/Build-Gerekmez-16a34a)
![License](https://img.shields.io/badge/Lisans-MIT-blue)

</div>

---

## ✨ Özellikler

| | |
|---|---|
| 👤 **Kişisel** | Çocuk adını yazar, oyun ona hitap eder |
| 🎲 **Karışık mod** | 1–10 arası tüm tablolardan karışık sorular |
| 🔢 **Belirli tablo** | Örn. 9'ları seçince **Sıradan** (9×1, 9×2…) veya **Karışık** sorar |
| 🔊 **Sesli + görsel** | Her soru "yedi kere sekiz" gibi seslendirilir *ve* ekrana yazılır. Sesler **ElevenLabs** ile üretilmiş doğal Türkçe kliplerdir ve uygulamaya gömülüdür — internet, API anahtarı veya cihazın TTS motoru gerekmez (eski/kısıtlı telefonlarda da çalışır) |
| ⭐ **Ödül sistemi** | Puan, yıldız, seri (streak), konfeti ve rozetler |
| 🚪 **Çıkış** | Soru sırasında istediğin an menüye dönebilme |
| 🏆 **Lider tablosu** | Skorlar Cloudflare D1'de saklanır, en iyiler listelenir |
| 📱 **PWA** | Telefonda/tablette "Ana ekrana ekle" ile uygulama gibi çalışır, çevrimdışı açılır |
| 📐 **Responsive** | Büyük dokunmatik tuş takımı; telefon, tablet, bilgisayar uyumlu |

---

## 🕹️ Nasıl oynanır?

```
Adını yaz  →  Mod seç (Karışık / bir tablo)  →  (tablo ise) Sıradan mı Karışık mı?
           →  Soruları çöz (sesli + ekranda)  →  Puan & yıldız kazan  →  🏆 Lider tablosu
```

---

## 🎙️ Seslendirme

Oyundaki tüm sesler [ElevenLabs](https://elevenlabs.io) ile **önceden bir kez üretilmiş** hazır dosyalardır.

| | |
|---|---|
| 🤖 **Model** | `eleven_v3` (ElevenLabs'in en doğal/ifadeli modeli) |
| 🗣️ **Ses** | Matilda — sıcak, anlaşılır, çocuklara uygun |
| 🇹🇷 **Dil** | Türkçe (`tr`); sayılar rakamla değil yazıyla seslendirildi ("yetmiş iki") |
| 🎧 **Format** | AAC / `.m4a`, 22 kHz mono — klip başına ~15 KB, toplam ~3 MB |

**206 klip** şöyle adlandırılır:

| Dosya | Örnek | Ne zaman çalar |
|---|---|---|
| `s_AxB.m4a` (100 adet) | `s_7x8` → "Yedi kere sekiz." | Soru ekrana gelince / 🔁 tekrar düğmesi |
| `n_N.m4a` (100 adet) | `n_56` → "Elli altı." | İki yanlıştan sonra doğru cevap |
| `dogrusu.m4a` | "Doğrusu…" | Doğru cevaptan hemen önce |
| `aferin` · `super` · `dogru` · `harikasin` | "Aferin!", "Süper!"… | Doğru cevapta (rastgele) |
| `tekrardene.m4a` | "Tekrar dene!" | İlk yanlışta |

> 🔑 **Uygulama ElevenLabs'e hiç bağlanmaz.** API anahtarı yalnızca sesler üretilirken kullanıldı; kodda, repoda veya yayındaki sitede **yer almaz**. Oyun oynandıkça ek ücret de oluşmaz.

Sesleri değiştirmek isterseniz, aynı adlarla yeni `.m4a` dosyaları koyup `public/sw.js` içindeki `CACHE` sürümünü artırmanız (ör. `carpim-v6` → `carpim-v7`) yeterlidir; böylece yüklü uygulamalar yeni sesleri indirir.

---

## 🧱 Mimari

```
Tarayıcı (PWA)
   │  fetch /api/scores
   ▼
Cloudflare Worker  ──►  D1 Veritabanı (skorlar)
   │
   └──►  Statik dosyalar (public/)
```

| Dosya | Görevi |
|---|---|
| `public/index.html` | Tüm oyun: arayüz, ses, puan, yerel kayıt |
| `public/manifest.webmanifest` · `public/sw.js` | PWA: yüklenebilirlik + çevrimdışı önbellek |
| `public/icon-*.png` | Uygulama ikonları |
| `public/audio/*.m4a` | 206 Türkçe ses klibi: sorular, cevaplar, geri bildirim (bkz. [Seslendirme](#-seslendirme)) |
| `worker.js` | Cloudflare Worker: `/api/scores` (D1) + statik sunum |
| `schema.sql` | D1 tablo şeması |
| `wrangler.toml` | Worker + D1 + statik varlık ayarları |

**Teknoloji:** Saf HTML/CSS/JS (çerçeve/derleme yok) · ElevenLabs ile üretilmiş ses klipleri (seslendirme) · Cloudflare Workers + D1.

---

## 🚀 Kendi hesabınızda yayınlama

Gereken: [Node.js](https://nodejs.org) ve bir Cloudflare hesabı.

**1. Bağımlılık yok** — doğrudan `npx wrangler` kullanılır.

**2. D1 veritabanını oluşturun:**
```bash
npx wrangler d1 create carpim_tablosu
```
Çıktıdaki `database_id` değerini `wrangler.toml` içine yazın.

**3. Tabloyu oluşturun:**
```bash
npx wrangler d1 execute carpim_tablosu --remote --file=./schema.sql
```

**4. Yayınlayın:**
```bash
npx wrangler deploy
```

> **Kimlik doğrulama:** `npx wrangler login` (tarayıcıdan) **veya** ortam değişkenleri ile:
> ```bash
> export CLOUDFLARE_API_TOKEN="KENDI_TOKENINIZ"      # D1 + Workers Scripts (Edit) izinli
> export CLOUDFLARE_ACCOUNT_ID="KENDI_HESAP_IDNIZ"
> ```

### Yerel geliştirme
```bash
npx wrangler dev        # http://localhost:8787 (yerel D1 ile)
```
Sadece arayüzü görmek isterseniz `public/index.html` dosyasına çift tıklamanız yeterli (lider tablosu pasif olur; skorlar yalnızca cihazda tutulur).

### Veritabanı işlemleri
```bash
npx wrangler d1 execute carpim_tablosu --remote --command "SELECT * FROM scores;"
npx wrangler d1 execute carpim_tablosu --remote --command "DELETE FROM scores;"   # sıfırla
```

---

## 🔒 Güvenlik

- 🔑 **Hiçbir API anahtarı kodda yer almaz.** D1'e "binding" ile erişilir; token yalnızca deploy sırasında ortam değişkeni olarak kullanılır.
- 🎙️ ElevenLabs anahtarı yalnızca sesleri üretirken kullanıldı; uygulama çalışırken hiçbir harici ses servisine istek atmaz.
- 🚫 `.gitignore`, `.wrangler/`, `.dev.vars` ve `node_modules/` klasörlerini dışarıda tutar — sırlar repoya girmez.
- ✅ API girişleri sunucu tarafında doğrulanır ve sınırlanır (isim uzunluğu, sayısal aralıklar) — SQL sorguları parametrelidir.

---

## 📄 Lisans

MIT — bkz. [LICENSE](LICENSE). Dilediğiniz gibi kullanın, geliştirin, paylaşın.

<div align="center">
<sub>❤️ ile çocuklar için yapıldı · Seslendirme: <a href="https://elevenlabs.io">ElevenLabs</a></sub>
</div>
