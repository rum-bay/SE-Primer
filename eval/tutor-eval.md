# Sokratik rehber değerlendirmesi

## Yöntem

Ödevdeki yöntem uygulandı: rehbere 20 farklı öğrenci yanıtı verildi; her yanıt “doğru cevabı ele veriyor mu?” ve “karara yeterince bağlanıyor mu?” başlıklarıyla elle etiketlendi. Örnek kayıtlar uygulamadaki mevcut yerel Sokratik yedek yanıtlarıdır. Canlı Gemini modeli bağlantısı bu ölçümde kullanılmadı.

## Sonuç

| Ölçüt | Sonuç | Oran | Örnek sayısı |
|---|---:|---:|---:|
| Doğru seçeneği/doğrudan çözümü açıklama | 0 | 0% | 20 |
| Bağlamı yeterince özelleştirmeyen genel soru | 2 | 10% | 20 |
| Açık uçlu soru biçimini koruma | 20 | 100% | 20 |

Yanıt sızdırma hatası görülmedi. 20 yanıtın 18'inde rehber ilgili kararın risk alanına dönüyor. 2 kısa/boş öğrenci yanıtında rehber, hangi senaryo olduğunu anımsatan daha bağlama özgü bir takip sorusu sormak yerine genel kanıt sorusu üretiyor.

## Hata türleri ve örnekler

- **Bağlamı fazla genel — 2/20 (%10):** #6 “Bilmiyorum.” ve #16 “??”. Yanıt sızdırmıyor, fakat ilgili kararın adını/kanıtını içeren bir takip sorusuyla iyileştirilebilir.
- **Doğrudan cevabı ele verme — 0/20 (%0):** Hiçbir rehber yanıtı A/B seçeneğini söylemiyor veya oyuncu yerine eylem seçmiyor.
- **Sokratik rehber yerine hüküm veriyor — 0/20 (%0):** 20 çıktının tümü soru işaretiyle biten açık uçlu sorudur.

## 20 örneğin elle incelenen çıktıları

| # | Karar | Öğrenci yanıtı | Rehber yanıtı | Elle etiket |
|---:|---|---|---|---|
| 1 | Mimari | Eski sürüme hemen dönelim. | Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin? | Sızdırma yok; bağlama uygun |
| 2 | Mimari | Veritabanı geçişini hatırlamıyorum. | Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin? | Sızdırma yok; bağlama uygun |
| 3 | Mimari | Muhtemelen veritabanı şeması değişmedi. | Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin? | Sızdırma yok; bağlama uygun |
| 4 | Mimari | SQL yaması mı yazsam? | Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin? | Sızdırma yok; bağlama uygun |
| 5 | Mimari | Kuyruk büyüyor, geri almak en hızlısı. | Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin? | Sızdırma yok; bağlama uygun |
| 6 | Mimari | Bilmiyorum. | Biraz daha açalım: hangi gözlemlenebilir kanıt kararını destekler? | Sızdırma yok; genel soru |
| 7 | Mimari | Versiyon numarasına bakarım. | Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin? | Sızdırma yok; bağlama uygun |
| 8 | Mimari | Önce yedek alırım. | Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin? | Sızdırma yok; bağlama uygun |
| 9 | Test | Canlıya basalım. | Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin? | Sızdırma yok; bağlama uygun |
| 10 | Test | Duman testini nasıl yapacağımı bilmiyorum. | Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin? | Sızdırma yok; bağlama uygun |
| 11 | Test | Randevu oluşturma ve iptal akışına bakarım. | Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin? | Sızdırma yok; bağlama uygun |
| 12 | Test | Sadece loglara bakalım. | Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin? | Sızdırma yok; bağlama uygun |
| 13 | Test | Önce kalite ekibinden onay alırım. | Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin? | Sızdırma yok; bağlama uygun |
| 14 | Test | Kademeli açmak mantıklı. | Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin? | Sızdırma yok; bağlama uygun |
| 15 | Test | Süre kazanmak için testi atlarız. | Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin? | Sızdırma yok; bağlama uygun |
| 16 | Test | ?? | Biraz daha açalım: hangi gözlemlenebilir kanıt kararını destekler? | Sızdırma yok; genel soru |
| 17 | KVKK | İsmi maskeleyip kanala gönderirim. | Bu inceleme için gerçekten gerekli veri nedir ve kimlerin erişmesi gerekir? | Sızdırma yok; bağlama uygun |
| 18 | KVKK | Gerekli olmayan adı silmek gerekir. | Bu inceleme için gerçekten gerekli veri nedir ve kimlerin erişmesi gerekir? | Sızdırma yok; bağlama uygun |
| 19 | KVKK | Rastgele bir ID kullanırım. | Bu inceleme için gerçekten gerekli veri nedir ve kimlerin erişmesi gerekir? | Sızdırma yok; bağlama uygun |
| 20 | KVKK | Herkes görsün ki hızlı çözelim. | Bu inceleme için gerçekten gerekli veri nedir ve kimlerin erişmesi gerekir? | Sızdırma yok; bağlama uygun |

## Yeniden çalıştırma

Depo kökünde **npm run eval:tutor** komutu 20 kaydı ve her yanıtın soru biçimini kontrol eder, doğrudan cevap sızıntısı taraması yapar ve oranları yeniden hesaplar.
