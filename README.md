# Image Resizer CLI

Resimleri küçültüp WebP formatına dönüştüren CLI aracı.

## Kurulum

```bash
npm install
npm link
```

## Kullanım

### Temel Kullanım
```bash
resize image.jpg
```
Aynı dizinde `image.webp` dosyası oluşturur (boyut %50 küçültülür).

### Çıktı Dizini Belirtme
```bash
resize image.jpg output/
```
Belirtilen dizine kaydeder.

### Çıktı Dosya Yolu Belirtme
```bash
resize image.jpg output/new-image.webp
```
Belirtilen yere kaydeder.

### Boyut Belirtme
```bash
resize image.jpg -w 800 -h 600
```
Genişlik ve yüksekliği belirtir.

### Kalite Ayarlama
```bash
resize image.jpg -q 90
```
WebP kalitesini 1-100 arası belirler (varsayılan: 80).

### Örnekler
```bash
# Basit kullanım
resize photo.jpg

# Dizine kaydet
resize photo.jpg images/

# Özel boyut ve kalite
resize photo.jpg -w 1920 -h 1080 -q 85 -o output/

# Tam yol belirtme
resize photo.jpg -o /path/to/output/converted.webp
```

## Seçenekler

- `-o, --output <path>`: Çıktı dizini veya dosya yolu
- `-w, --width <number>`: Hedef genişlik (piksel)
- `-h, --height <number>`: Hedef yükseklik (piksel)
- `-q, --quality <number>`: WebP kalitesi (1-100, varsayılan: 80)

## Notlar

- Eğer boyut belirtilmezse, resim %50 küçültülür
- Çıktı dizini yoksa otomatik oluşturulur
- Desteklenen formatlar: JPEG, PNG, GIF, WebP, TIFF, BMP, SVG
