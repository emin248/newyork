# Baki Sumqayit Android Tətbiqi - Təlimat

Bu qovluqda sizin veb-saytınızı (`https://www.baki-sumqayit.site/`) Android tətbiqi kimi işlədən kodlar yerləşir.

## 1. Hazırlıq

Kompüterinizdə `Node.js` quraşdırılıb. İndi bu layihənin kitabxanalarını yükləmək lazımdır.
Terminalda (`cmd` və ya `PowerShell`) bu qovluğa daxil olun və aşağıdakı əmri yazın:

```bash
npm install
```

Bu əmr `node_modules` qovluğunu yaradacaq və lazımi faylları internetdən yükləyəcək.

## 2. Tətbiqi Yoxlamaq (Test)

Tətbiqi telefonunuzda yoxlamaq üçün telefonunuza **Expo Go** tətbiqini (Play Store-dan) yükləyin.
Sonra terminalda bu əmri yazın:

```bash
npx expo start
```

Ekrana QR kod çıxacaq. Telefonunuzda Expo Go tətbiqini açıb "Scan QR Code" düyməsi ilə həmin kodu skan edin. Tətbiq telefonunuzda açılacaq.

## 3. Google Play üçün Faylın Hazırlanması (.AAB)

Google Play Console `.aab` (Android App Bundle) formatını tələb edir. Bunu yaratmaq üçün **EAS (Expo Application Services)** istifadə olunur.

### Addım 3.1: EAS CLI quraşdırın
Əgər yoxdursa:
```bash
npm install -g eas-cli
```

### Addım 3.2: Expo hesabına giriş
```bash
eas login
```
(Əgər hesabınız yoxdursa, `expo.dev` saytında qeydiyyatdan keçin).

### Addım 3.3: Layihəni konfiqurasiya edin
```bash
eas build:configure
```

### Addım 3.4: Android üçün Build edin
```bash
eas build --platform android
```
Bu proses zamanı sizdən "Keystore" barədə soruşulacaq. İlk dəfədirsə, "Generate new keystore" seçin.

Proses bitdikdən sonra sizə `.aab` faylını yükləmək üçün link veriləcək. Həmin faylı yükləyin.

## 4. Google Play Console-a Yükləmə

1. [Google Play Console](https://play.google.com/console) hesabınıza daxil olun.
2. "Create App" düyməsini sıxın.
3. Tətbiqin adını, dilini və s. seçin.
4. Sol menyudan "Production" bölməsinə keçin.
5. "Create new release" seçin.
6. Yüklədiyiniz `.aab` faylını bura atın.
7. Tələb olunan digər məlumatları (ekran görüntüləri, təsvir, yaş reytinqi və s.) doldurun.
8. "Review and rollout" edərək tətbiqi yayımlayın.

Uğurlar!
