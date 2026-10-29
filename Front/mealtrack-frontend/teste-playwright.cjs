const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: false
    });

    const page = await browser.newPage();

    await page.goto('http://localhost:9091');

    console.log('Página aberta com sucesso!');

    await page.waitForTimeout(5000);

    await browser.close();
})();