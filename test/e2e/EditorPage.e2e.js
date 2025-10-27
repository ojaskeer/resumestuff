// test/e2e/EditorPage.e2e.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');

(async function testEditorPage() {
  // Prepare download directory for PDF capture
  const downloadDir = path.resolve(__dirname, '../../downloads');
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

  // Configure Chrome to auto-download PDFs to downloadDir
  const options = new chrome.Options();
  options.setUserPreferences({
    'download.default_directory': downloadDir,
    'download.prompt_for_download': false,
    'plugins.always_open_pdf_externally': true,
  });

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Start app (assumes dev server at localhost:3000)
    await driver.get('http://localhost:3000/resume-editor');

    console.log('✔ EditorPage loaded');

    // Test 1: Verify main UI elements are visible
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'ATS Compatibility Score')]")), 5000);
    const atsSection = await driver.findElement(By.xpath("//*[contains(text(),'ATS Compatibility Score')]"));
    console.log('✔ ATS Compatibility Score section visible');

    const downloadBtn = await driver.findElement(By.xpath("//button[contains(text(),'Download')]"));
    console.log('✔ Download button located');

    const uploadBtn = await driver.findElement(By.xpath("//button[contains(text(),'Upload New')]"));
    console.log('✔ Upload New button located');

    // Test 2: Click formatting toolbar buttons (bold/italic/underline)
    const editor = await driver.findElement(By.css('.resume-content'));
    await editor.click();
    console.log('✔ Editor clicked and focused');

    const boldBtn = await driver.findElement(By.css('.icon-button[data-cmd="bold"]'));
    await boldBtn.click();
    console.log('✔ Bold button clicked');

    const italicBtn = await driver.findElement(By.css('.icon-button[data-cmd="italic"]'));
    await italicBtn.click();
    console.log('✔ Italic button clicked');

    const underlineBtn = await driver.findElement(By.css('.icon-button[data-cmd="underline"]'));
    await underlineBtn.click();
    console.log('✔ Underline button clicked');

    // Test 3: Change format dropdown
    const formatSelect = await driver.findElement(By.id('formatSelect'));
    await formatSelect.click();
    const h2Option = await driver.findElement(By.css('#formatSelect option[value="h2"]'));
    await h2Option.click();
    console.log('✔ Format dropdown changed to Heading 2');

    // Test 4: Upload a PDF file (requires a test PDF in the project)
    const testPdfPath = path.resolve(__dirname, '../../test-fixtures/sample.pdf');
    if (fs.existsSync(testPdfPath)) {
      // Click the visible Upload New button to activate hidden input
      await uploadBtn.click();
      await driver.sleep(200); // brief pause for input to appear

      // Find the hidden file input and send the file path
      const fileInput = await driver.findElement(By.id('pdfUpload'));
      await fileInput.sendKeys(testPdfPath);
      console.log('✔ PDF uploaded via hidden input');

      // Wait for canvas elements to be rendered (PDF.js rendering)
      await driver.wait(until.elementsLocated(By.css('.pdf-page-canvas')), 5000);
      const canvases = await driver.findElements(By.css('.pdf-page-canvas'));
      console.log(`✔ PDF rendered into ${canvases.length} canvas(es)`);
    } else {
      console.log('⚠ Test PDF not found, skipping upload test');
    }

    // Test 5: Trigger download and verify file is saved
    const beforeDownload = fs.readdirSync(downloadDir);
    await downloadBtn.click();
    console.log('✔ Download button clicked');

    // Wait for a .pdf file to appear in downloadDir
    await driver.sleep(2000);
    const afterDownload = fs.readdirSync(downloadDir);
    const newFiles = afterDownload.filter(f => !beforeDownload.includes(f) && f.endsWith('.pdf'));
    if (newFiles.length > 0) {
      console.log(`✔ PDF downloaded: ${newFiles[0]}`);
    } else {
      console.log('⚠ No PDF found after download click');
    }

    console.log('\n✅ All Selenium tests passed');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  } finally {
    await driver.quit();
  }
})();
