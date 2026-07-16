const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


function findHtmlFiles(dir) {

  if (!fs.existsSync(dir)) {
    console.log(`❌ 경로가 존재하지 않습니다 : ${dir}`);
    return [];
  }

  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(dir, file));
}


/*
 * 폰트명 비교용
 */
function normalizeFont(font) {

  return font
    .toLowerCase()
    .replace(/[-_\s]/g, '');

}

/*
 * 프로젝트 웹폰트 여부 판단
 */
function isProjectFont(actualFont, webFonts) {
  const actual = normalizeFont(actualFont);

  return webFonts.some(font => {
    const srcName = font.src.match(/([^\/\\]+)\.(woff2?|ttf|otf|eot)/i);
    if (!srcName)
      return false;

    const fileName =
      normalizeFont(
        srcName[1]
      );
    return (
      actual.includes(fileName) ||
      fileName.includes(actual)
    );
  });
}
/*
 * fallback 위치 표시
 */
function getSelector(node) {
  let selector = node.nodeName.toLowerCase();

  if (node.attributes) {
    const idIndex = node.attributes.indexOf('id');
    const classIndex = node.attributes.indexOf('class');

    if (idIndex !== -1) {
      selector =
        "#" + node.attributes[idIndex + 1];
    }
    else if (classIndex !== -1) {
      const className =
        node.attributes[classIndex + 1]
          .trim()
          .split(/\s+/)
          .join(".");

      if (className) {
        selector = "." + className;

      }
    }
  }
  return selector;
}
function getTextContent(node) {

  if (!node.children)
    return "";

  const text =
    node.children
      .filter(child => child.nodeType === 3)
      .map(child => child.nodeValue.trim())
      .join(" ");

  return text
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 50);

}
async function checkFonts(){

    const args = process.argv.slice(2);

    if(
        args.includes("-h") ||
        args.includes("--help")
    ){
        console.log(`
=========================================================
Font Validation Tool
=========================================================

사용법:
  node check-fonts.js [HTML Folder Path]

예시:
  node check-fonts.js D:/workspace/html

`);
        return;
    }
    const htmlFolder = args[0];

  console.log(`
=========================================================
🚀  총 ${htmlFiles.length}개 HTML 검사
=========================================================
`);
  const browser =
    await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--allow-file-access-from-files'
      ]
    });

  const finalReport = {
    fallback: [],
    webfontFail: []
  };

  let passCount = 0;
  let warningCount = 0;
  let failCount = 0;
  let index = 1;

  // 로컬 환경에서만 폰트여부 확인 가능
  for (const filePath of htmlFiles) {
    const page = await browser.newPage();
    await page.goto(
      'file:///' +
      filePath.replace(/\\/g, '/'),
      {
        waitUntil: 'networkidle0'
      }
    );

    const client = await page.target().createCDPSession();
    await client.send('DOM.enable');
    await client.send('CSS.enable');

    const shortPath =
      filePath
        .replace(htmlFolder, '')
        .replace(/^[\\\/]/, '');
    console.log(`
▓▓ [${index}/${htmlFiles.length}] 📄 ${shortPath}
`);
    /*
     * 현재 페이지에서 로드된 웹폰트 목록
     */
    const webFonts = await page.evaluate(() => {
      const fonts = [];

      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSFontFaceRule) {
              const family = rule.style.fontFamily.replace(/['"]/g, '');
              const src = rule.style.src;

              fonts.push({
                family: family,
                src: src
              });
            }
          }
        }
        catch (e) {
          continue;
        }
      }
      return fonts;
    });

    const renderedFonts = new Map();
    const fallbackList = [];
    const { nodes } =
      await client.send(
        'DOM.getFlattenedDocument',
        {
          depth: -1,
          pierce: true
        }

      );

    for (const node of nodes) {
      if (node.nodeType !== 1)
        continue;
      const skipTags = ['script', 'style', 'html', 'head', 'meta', 'link', 'body'];
      if (skipTags.includes(node.nodeName.toLowerCase()))
        continue;
      try {
        const fontResult =
          await client.send(
            'CSS.getPlatformFontsForNode',
            {
              nodeId: node.nodeId
            }
          );
        if (!fontResult.fonts || fontResult.fonts.length === 0)
          continue;

        const computed =
          await client.send(
            'CSS.getComputedStyleForNode',
            {
              nodeId: node.nodeId
            }
          );
        const weight = computed.computedStyle.find(item => item.name === "font-weight")?.value || "400";

        for (const font of fontResult.fonts) {
          const actualFont = font.postScriptName || font.familyName || "Unknown Font";
          /*
           * 실제 렌더링 폰트 저장
           */
          if (!renderedFonts.has(actualFont)) {
            renderedFonts.set(
              actualFont,
              new Set()
            );
          }
          renderedFonts
            .get(actualFont)
            .add(weight);
          /*
           * 프로젝트 웹폰트가 아닌 경우만 fallback 처리
           */
          if (!isProjectFont(actualFont, webFonts)) {
            fallbackList.push({
              selector:
                getSelector(node),
              text:
                getTextContent(node),
              font:
                actualFont,
              weight:
                weight
            });
          }
        }
      }
      catch (e) {
        continue;
      }
    }
    /*
     * HTML별 실제 렌더링 폰트 출력
     */

    console.log(`🎨 Rendered Fonts`);
    if (renderedFonts.size === 0) {
      console.log("  - 감지된 폰트 없음");
    }
    else {
      renderedFonts.forEach(
        (weights, font) => {
          console.log(`  - ${font} - CSS weight : ${[...weights].join(", ")}`);
        }
      );
    }
    let result = "PASS";
    /*
     * 예상하지 않은 시스템 폰트 발견
     */
    if (fallbackList.length > 0) {
      result = "WARNING";
      warningCount++;

      finalReport.fallback.push({
        html:
          shortPath,
        fonts:
          fallbackList
      });
      console.log(`
⚠️ Unexpected Fallback`);
      /*
       * 공간 절약 출력
       */
      fallbackList.forEach(item => {
        if (item.text) {
          console.log(
            `  ${item.selector} ("${item.text}") → ${item.font}`
          );
        }else {
          console.log(
            `  ${item.selector} → ${item.font}`
          );
        }
      });
    } else {
      passCount++;
    }
    console.log(`
RESULT : ${result}`);
    console.log('────────────────────────────────────────');

    await page.close();
    index++;
  }
  await browser.close();

  /*
   * 최종 결과
   */
  console.log(`
=========================================================
📊 FINAL FONT VALIDATION REPORT
=========================================================
`);

  console.log(`
PASS    : ${passCount}
WARNING : ${warningCount}
FAIL    : ${failCount}
`);
  /*
   * 최종 fallback 목록
   */
  if (finalReport.fallback.length > 0) {
    console.log(`

=========================================================
⚠️ UNEXPECTED FALLBACK HTML
=========================================================
`);
    finalReport.fallback
      .forEach(item => {
        console.log(`📄 ${item.html}`);
      });
  }

  /*
   * 웹폰트 로드 실패 영역
   */
  if (finalReport.webfontFail.length > 0) {
    console.log(`

=========================================================
❌ WEBFONT LOAD FAIL
=========================================================
`);

    finalReport.webfontFail
      .forEach(item => {
        console.log(`
📄 ${item.html}
Expected :
${item.expected}

Actual :
${item.actual}
`);
      });
  }
}
checkFonts();