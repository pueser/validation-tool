# Validation Tools

> Node.js 기반 HTML 및 웹폰트 검증 자동화 도구 모음

Validation Tools는 HTML 문서의 구조와 웹폰트 적용 상태를 자동으로 검증하기 위한 Node.js 기반 CLI(Command Line Interface) 도구 모음입니다.

현재 다음 두 가지 검증 도구를 제공합니다.

---

# 📂 Projects

## 1. HTML Finder

CSS Selector를 이용하여 HTML/XHTML 파일에서 원하는 요소를 검색하는 도구입니다.

### 주요 기능

- HTML/XHTML 파일 재귀 검색
- CSS Selector 기반 요소 검색
- 검색된 요소의 라인 번호 출력
- HTML 코드 미리보기 출력
- 검색 결과 통계 제공

**Directory**

```
html-finder/
```

---

## 2. Font Checker

Chrome DevTools Protocol(CDP)을 이용하여 브라우저에서 실제 렌더링된 폰트를 분석하고, 예상하지 않은 Fallback Font를 검출하는 도구입니다.

### 주요 기능

- 실제 렌더링된 폰트 확인
- PostScript Name 기반 폰트 검증
- Fallback Font 검출
- Font Weight 확인
- HTML별 검증 결과 출력

**Directory**

```
font-checker/
```

---

# Repository Structure

```
validation-tool/
│
├── README.md
│
├── html-finder/
│   ├── README.md
│   └── HtmlFinder.js
│
└── font-checker/
    ├── README.md
    └── check-fonts.js
```

---

# Requirements

- Node.js 18+
- npm
- Puppeteer
- Cheerio

---

# Installation

저장소를 Clone한 후 필요한 패키지를 설치합니다.
