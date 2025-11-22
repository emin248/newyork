const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Mobil ekran ölçüsü
    await page.setViewport({ width: 412, height: 915, isMobile: true });

    console.log('Sayta daxil olunur...');
    await page.goto('https://www.baki-sumqayit.site/', { waitUntil: 'networkidle0' });

    // 1. Əsas ekran
    console.log('Şəkil 1 çəkilir...');
    await page.screenshot({ path: 'screenshots/screen_1.png' });

    // 2. Bir az aşağı scroll edirik
    console.log('Scroll edilir...');
    await page.evaluate(() => {
        window.scrollBy(0, 300);
    });
    await new Promise(r => setTimeout(r, 1000)); // Animasiya üçün gözləmə
    console.log('Şəkil 2 çəkilir...');
    await page.screenshot({ path: 'screenshots/screen_2.png' });

    // 3. Daha aşağı və ya fərqli bir element
    await page.evaluate(() => {
        window.scrollBy(0, 300);
    });
    await new Promise(r => setTimeout(r, 1000));
    console.log('Şəkil 3 çəkilir...');
    await page.screenshot({ path: 'screenshots/screen_3.png' });

    await browser.close();
    console.log('Hazırdır!');
})();
