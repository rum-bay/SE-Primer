# SE Primer

Türkçe, mobil öncelikli bir yazılım mühendisliği karar simülatörü. Öğrenci kurgu bir sağlık yazılımı kesintisinde üç karar verir; uygulama her seçimin teknik ve insani sonucunu açıklar.

## Ödev gereklilikleri

- `spec.md`: problem, hedef, kapsam, akış şeması, kabul örnekleri ve başarı ölçüleri.
- Google Stitch: giriş, olay/karar ve son raporu kapsayan üç mobil ekran. [Stitch projesini aç](https://stitch.withgoogle.com/projects/16998834271951659543?pli=1).
- Google AI Studio: Stitch tasarımından açılan Build Mode çalışma alanı. Durum ve bağlantı: `STITCH-AND-AI-STUDIO.md`.
- Sokratik rehber değerlendirmesi: `eval/tutor-cases.json` içindeki 20 örnek ve elle etiketli `eval/tutor-eval.md`.
- Cypress E2E: `cypress/e2e/game.cy.js` içindeki başlangıç, kişiselleştirme, rehber, sayaç aşımı ve 8 karar kombinasyonu.
- 60 saniyelik Türkçe açıklamalı görsel demo: `media/demo/primer-demo.mp4` (canlı ekran kaydı değildir).
- Ürün kararları: aşağıdaki üç tek cümlelik kapsam dışı özellik.

## Yerelde çalıştırma

Node.js 20+ ve npm gerekir. Proje klasöründe:

```sh
npm install
npm start
```

Uygulama `http://127.0.0.1:4173` adresinde açılır. Sokratik rehber, bağlantı anahtarı olmadan yerel soru şablonları kullanır. İsteğe bağlı Gemini bağlantısı için anahtarı yalnızca sunucu ortam değişkeni olarak tanımla; `.env` veya Git'e yazma:

```powershell
$env:GEMINI_API_KEY = "..."
npm start
```

Varsayılan model `gemini-3.8-flash` olarak sunucuda yapılandırılır ve `GEMINI_MODEL` ile değiştirilebilir. Gemini etkinleştirilirse rehbere yazılan metin Google Gemini API'sine gönderilir. Gerçek hasta verisi yazma. Uygulama yanıtları saklamaz.

## E2E ve tarayıcı doğrulaması

```sh
npm run test:e2e
```

Bu ödev ortamında Cypress'in Electron çalıştırıcısı başlatılırken Windows'ta `0xC0000005` ile kapandı; bu nedenle resmi Cypress komutu tamamlanamadı. Aynı yerel uygulama tarayıcıda etkileşimli olarak kontrol edildi: 8/8 karar kombinasyonu beklenen sona ulaştı, deneyimli mod `01:00` sayacını gösterdi ve rehber doğru cevabı vermeden soru sordu. Cypress dosyası yeniden çalıştırılmaya hazırdır.

## Sokratik rehber değerlendirmesini yeniden çalıştırma

```sh
npm run eval:tutor
```

Son ölçüm: **20** yerel yedek yanıt örneğinde cevap sızdırma **0/20 (%0)**, genel/bağlamı zayıf soru **2/20 (%10)** ve soru biçimi **20/20 (%100)**. Bu sonuç canlı Gemini ölçümü değildir. Etiketler ve örnekler `eval/tutor-eval.md` içinde.

## Tasarım ve teslim dosyaları

- Ürün tanımı, akış ve kabul örnekleri: `spec.md`
- Stitch tasarım niyeti, tokenlar ve mobil referans görüntüleri: `DESIGN.md` ve `media/screens/`
- Uygulama: `index.html`, `styles.css`, `app.js`, `server.mjs`
- Cypress akışları: `cypress/e2e/game.cy.js`
- Rehber örneklemi ve elle etiketler: `eval/`
- Görsel demo videosu ve 60 saniyelik akışı: `media/demo/primer-demo.mp4`, `DEMO-SCRIPT.md`
- Stitch ve AI Studio: `STITCH-AND-AI-STUDIO.md`

## Ürün kararı — bu sürümde yapılmayanlar

1. **Kullanıcı hesabı yok:** Tek oturumlu akışı telefonda hemen oynatıp temel değerini doğruluyoruz.
2. **İkinci senaryo yok:** Üç karar içeren tek vaka, seçimden sonuca öğrenme döngüsünü doğrulamaya yeterli.
3. **Gerçek hasta verisi veya klinik entegrasyonu yok:** Eğitim senaryosu sentetik veride kalır ve gerçek kayıtları sisteme taşımaz.

## Çalışan uygulama

[SE Primer uygulamasını aç](https://ai.studio/apps/89ef902a-d7ef-4e27-bf7e-0d3352aa11f9)
