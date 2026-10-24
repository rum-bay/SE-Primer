# DESIGN.md — SE Primer

## Tasarım niyeti

Uygulama, bir öğrencinin gece nöbet defterinden tek bir vaka açmış gibi hissettirsin. Kriz hissi renk ve tipografide görünür; karar ekranı panik yerine kanıt toplamayı teşvik eder. Arayüz küçük ekranda tek sütun, büyük ekranda ortalanmış bir telefon akışı olarak çalışır.

## Tasarım temelleri

- **Kâğıt zemini:** #F4F0E8; sıcak, düşük kontrastlı olmayan bir arka plan.
- **Mürekkep:** #202923; ana başlık ve metin.
- **Orman yeşili:** #2E4939; sistemin güvenli/kararlı durumu.
- **Mercan:** #DD6947; olay, soru numarası ve aciliyet.
- **Yüzey:** #FFFDF9; seçim ve sonuç kartları.
- **Çizgi:** #DCD6CA; kart ve ayraç kenarları.
- **Tipografi:** DM Sans gövde, DM Mono küçük operasyon etiketleri, Playfair Display anlatı başlıkları. Font yüklenemezse sistem fontlarıyla çalışır.
- **Şekil dili:** 12–17 px yuvarlatma, küçük monogram, ince ayraç ve kayıt defteri etiketleri.
- **Hareket:** seçimde kısa yükselme ve ilerleme çubuğu; reduced motion ayarı desteklenir.

## Ekranlar

1. **Giriş / profil:** “Bir karar, üç sonuç.” başlığı altında seviye, rol ve öğrenme hedefi üç ayrı soruda seçilir. Başlat düğmesi yalnızca üç yanıt da seçilince açılır.
2. **Sahne / karar:** 08:00 olay kartı, 300 bekleyen kişi, karar ilerlemesi ve iki seçenek. Yeni başlayan oyuncu için öğrenme rehberi ipucu; deneyimli oyuncu için 60 saniye sayacı vardır. Seçimden sonra aynı ekranda “ne oldu / neden oldu” açıklaması ve kısa öğrenme rehberi alanı görünür.
3. **Son / rapor:** İyi son yeşil damgayla, riskli son mercan damgayla ayrılır. Rol, öğrenme odağı ve bir sonraki nöbet için kısa yansıma gösterilir.

## Bileşen kuralları

- Seçim düğmeleri aria-pressed/aria-label ile erişilebilir; klavye odağı görünür.
- Düğme ve metin alanları 35–49 px yüksekliğindedir.
- Sonuç metni ve öğrenme rehberi yanıtı aria-live ile duyurulur.
- Gerçek hasta adı, gerçek log veya gerçek klinik bağlantısı örneklenmez.
- Renk tek başına sonucu kodlamaz; metin ve simge de kullanılır.

## Stitch başlangıç talimatı

Stitch'te Mobile seçip bu promptu kullan:

> Tasarla: “SE Primer”, Türkçe bir yazılım mühendisliği karar simülatörü. Üç mobil ekran üret: (1) girişte seviye, rol ve öğrenme hedefi için üç net soru; (2) 08:00’de randevu sistemi çökmüş, 300 kişi bekliyor; mimari, test ve KVKK alanında iki karar seçeneği ve Sokratik öğrenme rehberi ipucu; (3) iyi/kötü son raporu. Kâğıt rengi #F4F0E8, orman yeşili #2E4939, mercan #DD6947, kırık beyaz kartlar. Havadar editoryal tipografi: anlatıda serif, kontrollerde sade sans, küçük olay etiketlerinde mono. Öncelik küçük ekran, tek sütun, okunabilir kontrast ve dokunma hedefleri. Gerçek hasta verisi veya giriş ekranı ekleme.

## Ekran önizlemeleri

- media/screens/01-onboarding.png
- media/screens/02-decision.png
- media/screens/03-ending.png

Bu PNG'ler aynı görsel sistemle hazırlanmış mobil ekran referanslarıdır. Uygulamanın etkileşimli sürümü index.html ve app.js içinde çalışır.

## Google Stitch tasarımı

Üç ekranlı Stitch projesi: [SE Primer Incident Simulation](https://stitch.withgoogle.com/projects/16998834271951659543?pli=1). Ekranlar; profil seçimi, olay kararı ve nöbet raporunu kapsar. Google AI Studio'ya aktarım bu tasarım üzerinden başlatıldı.
