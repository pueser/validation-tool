const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const folder = process.argv[2];
const selector = process.argv[3];

if (!folder || !selector) {
    console.log("사용법:");
    console.log('node HtmlFinder.js "HTML폴더" "CSS선택자"');
    process.exit(1);
}

if (!fs.existsSync(folder)) {
    console.log("폴더를 찾을 수 없습니다.");
    process.exit(1);
}

let totalFiles = 0;
let matchedFiles = 0;
let totalMatches = 0;

function getHtmlFiles(dir) {
    let files = [];

    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            files.push(...getHtmlFiles(fullPath));
        } else if (/\.(html?|xhtml)$/i.test(item.name)) {
            files.push(fullPath);
        }
    }

    return files;
}

const htmlFiles = getHtmlFiles(folder);

console.log("========================================");
console.log("HTML Finder");
console.log("========================================");
console.log("폴더     :", folder);
console.log("선택자   :", selector);
console.log("");

for (const file of htmlFiles) {

    totalFiles++;

    let html;

    try {
        html = fs.readFileSync(file, "utf8");
    } catch {
        continue;
    }

    let $;

    try {
        $ = cheerio.load(html);
    } catch {
        continue;
    }

    let matches;

    try {
        matches = $(selector);
    } catch (err) {
        console.log("잘못된 CSS 선택자입니다.");
        console.log(err.message);
        process.exit(1);
    }

    if (matches.length === 0)
        continue;

    matchedFiles++;
    totalMatches += matches.length;

    console.log("------------------------------------------------------------");
    console.log(`${path.relative(folder, file)} (${matches.length}개)`);

    matches.each((i, el) => {

        const start = el.startIndex ?? html.indexOf($.html(el));
        const line = html.substring(0, start).split(/\r?\n/).length;

        let code = $.html(el);

        code = code.replace(/\s+/g, " ").trim();

        if (code.length > 200)
            code = code.substring(0, 200) + "...";

        console.log(`  [${i + 1}] Line ${line}`);
        console.log(`      ${code}`);
    });

    console.log("");
}

console.log("========================================");
console.log("검색 완료");
console.log("========================================");
console.log(`HTML 파일 수      : ${totalFiles}`);
console.log(`일치한 파일 수    : ${matchedFiles}`);
console.log(`총 일치 개수      : ${totalMatches}`);