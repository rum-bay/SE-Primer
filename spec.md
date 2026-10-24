# SE Primer — ürün spesifikasyonu

## Problem

Yeni yazılım mühendisliği öğrencileri mimari, test ve kişisel veri koruma kararlarını çoğu zaman gerçek üretim ortamına ilk kez çıktıklarında görür. Kısa bir kriz senaryosu, seçimin teknik sonucunu ve kullanıcıya etkisini güvenli bir kurgu içinde görünür kılar.

## Hedef kullanıcı ve değer

- Hedef: yazılım mühendisliğine yeni başlayan veya pratik kararlarını tazelemek isteyen öğrenci.
- Değer: oyuncu karar verir; uygulama ne olduğunu ve nedenini açıklar.
- Öğrenme yaklaşımı: öğrenme rehberi, seçeneğin doğru cevabını söylemek yerine kanıt ve etki üzerine soru sorar.

## Kapsam

### Yapılacak

- Telefonda çalışan, tek senaryolu web uygulaması.
- Başlangıçta üç kişiselleştirme sorusu: deneyim seviyesi, rol ve öğrenme hedefi.
- 08:00'de randevu sistemi kesintisini anlatan bir sağlık yazılımı senaryosu.
- Üç karar: mimari/geri dönüş, test ve KVKK.
- Her karardan sonra sonuç ve teknik gerekçe.
- Her üç kararda güvenli seçim yapılırsa iyi son; diğer yedi kombinasyonda riskli son.
- Yeni başlayanlara karar öncesi ipucu; deneyimli oyuncuya her karar için 60 saniye.
- Sokratik öğrenme rehberi: ipucu/soru verir, kararı veya doğru seçeneği açıklamaz.
- Tüm veriler kurgusal; gerçek hasta verisi uygulamaya girilmez ve yanıtlar kaydedilmez.

### Kapsam dışı

- Kullanıcı hesabı ve giriş.
- İkinci senaryo veya çok oyunculu mod.
- Gerçek hasta verisi ve gerçek klinik sistem entegrasyonu.
- Yerel mobil uygulama.

## Akış şeması

Başlangıç: seviye, rol, hedef
↓
Karar 1: mimari ve geri dönüş
↓
Sonuç + neden + öğrenme rehberi sorusu
↓
Karar 2: test ve yayına alma
↓
Sonuç + neden + öğrenme rehberi sorusu
↓
Karar 3: KVKK ve log
↓
Sonuç + neden + öğrenme rehberi sorusu
↓
Üç karar da güvenli mi?
├── Evet → İyi son: hizmet ve veri güvende
└── Hayır → Riskli son: risk büyüdü

## Kabul örnekleri

1. **Üç yanıt tamamlanmadan başlama:** Başlangıçta seviye, rol ve hedeften biri seçilmemişse “Nöbeti başlat” kapalı kalır; üçü seçilince etkinleşir.
2. **Yeni başlayan kişiselleştirmesi:** Oyuncu “Yeni başlıyorum” seçtiğinde her karar öncesi bir kanıt sorusu görür ve süre sayacı görmez.
3. **Deneyimli kişiselleştirmesi:** Oyuncu “Deneyimliyim” seçtiğinde her kararda 60 saniyelik sayaç açılır; süre dolarsa karar riskli kabul edilir.
4. **Karar sonrası öğrenme:** Oyuncu üç karardan herhangi birini seçince devam düğmesi görünmeden önce o seçimin sonucu ve teknik nedeni gösterilir.
5. **Veri gizliliği ve son:** Üç güvenli seçimin tümünde iyi son gösterilir; en az bir riskli seçim varsa riskli son gösterilir. Senaryoda gerçek kişi verisi bulunmaz.

## Durum ve karar kuralları

- Her kararın iki seçeneği vardır: A kontrollü/güvenli, B hız uğruna kontrolü veya mahremiyeti riske atan seçenek.
- Oyuncu seçiminden sonra seçenek düğmeleri devre dışı kalır; aynı karara ikinci kez yanıt eklenemez.
- Tüm seçimler güvenliyse iyi son; üç kararın içinden herhangi biri riskliyse riskli son.
- Deneyimli oyuncuda her kararın 60 saniyesi ayrı başlar. Süre aşımı o karar için riskli sonuç üretir.
- Rol ve hedef sonuç ekranında gösterilir; hedef ayrıca olay kartındaki odak cümlesini kişiselleştirir.

## Başarı ölçümü

- 8/8 karar kombinasyonunun beklenen sona gitmesi.
- 3/3 karar ekranında sonuç ve neden metninin görünmesi.
- Sokratik rehber değerlendirmesinde 20 örnekte cevap sızdırma oranı ve bağlam kalitesinin raporlanması.
- Başlangıç, karar ve son ekranlarının 390 px mobil genişliğinde kullanılabilir olması.
