# HTML Finder

> CSS Selector 기반 HTML 검색 자동화 도구

HTML, XHTML 파일을 재귀적으로 탐색하여 지정한 **CSS Selector**와 일치하는 요소를 검색하는 Node.js 기반 CLI(Command Line Interface) 도구입니다.

검색 결과로 **파일명**, **라인 번호**, **일치한 요소 개수**, **HTML 코드 일부**를 출력하여 HTML 유지보수 및 대량 문서 검증 작업을 빠르게 수행할 수 있습니다.

---

## 주요 기능

- HTML / XHTML 파일 재귀 검색
- CSS Selector 기반 요소 검색
- 검색된 요소의 라인 번호 출력
- HTML 코드 미리보기 출력
- 일치한 파일 및 요소 개수 통계 제공
- Cheerio 기반 빠른 HTML 파싱
- CLI(Command Line Interface) 지원

---

## 프로젝트 구조

```
HTMLFinder
│
├── HtmlFinder.js
├── package.json
├── README.md
└── node_modules
```

---

## 설치

### 1. 저장소 Clone

```bash
git clone https://github.com/pueser/validation-tool/HTMLFinder.git
```

### 2. 프로젝트 이동

```bash
cd HTMLFinder
```

### 3. 패키지 설치

```bash
npm install
```

또는

```bash
npm install cheerio
```

---

## 사용 방법

```bash
node HtmlFinder.js "HTML폴더경로" "CSS선택자"
```

### 예제

```bash
node HtmlFinder.js "./html" "table td img"
```

```bash
node HtmlFinder.js "./manual" "div.note"
```

```bash
node HtmlFinder.js "./output" "table[colsep='0']"
```

---

## 지원하는 CSS Selector 예시

```css
img

div.note

table td

ul > li

table tbody tr td

table td img

div.warning p

table[colsep='0']

div[class='notice']

table td:first-child
```

Cheerio에서 지원하는 대부분의 CSS Selector를 사용할 수 있습니다.

---

## 실행 결과 예시

```text
========================================
HTML Finder
========================================
폴더     : ./html
선택자   : table td img

------------------------------------------------------------
chapter01.html (2개)

  [1] Line 125
      <img src="image01.png">

  [2] Line 248
      <img src="image02.png">

------------------------------------------------------------
chapter02.html (1개)

  [1] Line 97
      <img src="figure01.png">

========================================
검색 완료
========================================
HTML 파일 수      : 15
일치한 파일 수    : 2
총 일치 개수      : 3
```

---

## 출력 정보

검색 결과에는 다음 정보가 포함됩니다.

- 검색된 HTML 파일명
- 해당 파일에서 일치한 요소 개수
- 요소의 라인 번호
- HTML 코드 일부
- 전체 HTML 파일 수
- 일치한 파일 수
- 총 일치 개수

---

## 사용 목적

다음과 같은 작업에서 활용할 수 있습니다.

- HTML 유지보수
- CSS 적용 대상 확인
- 특정 태그 검색
- HTML 구조 분석
- 대량 HTML 문서 검증
- QA 자동화

---

## 기술 스택

- Node.js
- Cheerio
- File System (fs)
- Path

---

## 요구 사항

- Node.js 18 이상 권장

---

## 수정이력

- 2026-07-22
  - `:pre()` 선택자 추가
    - 대상 요소의 **바로 이전 형제 요소**가 지정한 선택자와 일치하는 대상요소 확인
    - 사용 예시
      ```bash
      node HtmlFinder.js "./html" "table:pre(img)"
      ```
      → 바로 앞 형제 요소가 `img`인 `table`을 검색

  - `:not-parent()` 선택자 추가
    - 대상 요소의 **상위 부모 요소**에 지정한 선택자가 없는 경우에 대상요소 확인
    - 사용 예시
      ```bash
      node HtmlFinder.js "./html" "img:not-parent(ol)"
      ```
      → `ol` 요소 내부에 포함되지 않은 `img`를 검색

---

## 라이선스

MIT License
