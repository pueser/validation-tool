
# Font Validation Tool 사용자 설명서

# 1. 프로그램 개요

## 1.1 소개

**Font Validation Tool**은 HTML 문서에서 브라우저가 실제로 렌더링한 폰트를 분석하여 웹폰트 적용 여부를 자동으로 검증하는 Node.js 기반 도구입니다.

CSS에 선언된 `font-family`만 확인하는 것이 아니라 Chrome DevTools Protocol(CDP)을 이용하여 **실제 화면에 적용된 폰트(PostScript Name)** 를 분석하므로, 웹폰트 누락이나 Font Fallback 문제를 정확하게 확인할 수 있습니다.

---

# 2. 주요 기능

## 웹폰트 적용 검증

- HTML에서 사용되는 웹폰트 확인
- CSS `font-family`와 실제 렌더링 폰트 비교
- 웹폰트 적용 여부 자동 판정

---

## 실제 렌더링 폰트 확인

브라우저가 실제 화면 출력에 사용한 폰트 정보를 출력합니다.

출력 정보

- Rendered Font (PostScript Name)
- CSS Font Weight

예시

```
🎨 Rendered Fonts

- Roboto-Regular
  └ CSS weight : 400

- Roboto-Bold
  └ CSS weight : 700
```

---

## Unexpected Fallback 감지

지정한 웹폰트 대신 시스템 폰트가 사용된 경우 자동으로 감지합니다.

예시

```
⚠️ Unexpected Fallback

.text.error_description1 ("Network Error") → Arial
.howto_btn ("Confirm") → Arial
```

출력 정보

- HTML 위치(Selector)
- 화면에 표시되는 텍스트
- 실제 사용된 폰트

---

## HTML 파일별 검사 결과 출력

각 HTML 파일의 검사 결과를 출력합니다.

예시

```
▓▓ [1/20]
📄 chapter01.html

🎨 Rendered Fonts

- Roboto-Regular
  └ CSS weight : 400

RESULT : PASS
```

---

## 최종 검사 결과 출력

모든 HTML 검사 완료 후 결과를 출력합니다.

예시

```
=========================================================
📊 FINAL FONT VALIDATION REPORT
=========================================================

PASS    : 86
WARNING : 3
FAIL    : 0
```

---

# 3. 실행 환경

|항목|내용|
|-|-|
|Node.js|20.x 이상 권장|
|Chrome / Chromium|지원 버전|
|운영체제|Windows / macOS / Linux|

---

# 4. 설치 방법

## 4.1 프로젝트 다운로드

다음 두 가지 방법 중 하나를 선택합니다.

### 방법 1. Git Clone

```bash
git clone https://github.com/<username>/<repository>.git
```

### 방법 2. ZIP 다운로드

GitHub에서 **Code → Download ZIP**을 선택하여 프로젝트를 다운로드한 후 압축을 해제합니다.

---

## 4.2 프로젝트 폴더 이동

```bash
cd FontChecker
```

---

## 4.3 의존성 설치

프로젝트에서 사용하는 라이브러리를 설치합니다.

```bash
npm install
```

`package.json`에 정의된 모든 라이브러리가 자동으로 설치됩니다.

---

# 5. 실행 방법

## 실행 형식

```bash
node check-fonts.js <HTML 폴더 경로>
```

예시

```bash
node check-fonts.js D:/workspace/HTML
```

입력한 폴더 내부의 모든 `.html` 파일을 대상으로 검사를 수행합니다.

예시

```
HTML
├── chapter01.html
├── chapter02.html
└── chapter03.html
```

실행 결과

```
총 3개 HTML 검사
```

---

# 6. 검사 결과

## PASS

프로젝트에서 지정한 웹폰트가 정상적으로 렌더링된 경우

예시

```
RESULT : PASS
```

---

## WARNING

지정한 웹폰트 대신 다른 폰트가 렌더링된 경우

예시

```
⚠️ Unexpected Fallback

.notice_area ("Connection Failed")
→ Arial
```

이 경우 CSS 설정 또는 웹폰트 적용 상태를 확인해야 합니다.

---

## FAIL

웹폰트 로딩 실패 또는 검사 중 오류가 발생한 경우

---

# 7. 최종 결과 보고서

검사가 완료되면 전체 결과를 출력합니다.

예시

```
=========================================================
📊 FINAL FONT VALIDATION REPORT
=========================================================

PASS    : 86
WARNING : 3
FAIL    : 0
```

Fallback이 발생한 HTML도 함께 출력됩니다.

예시

```
=========================================================
⚠️ UNEXPECTED FALLBACK HTML
=========================================================

📄 chapter05.html
📄 chapter21.html
📄 chapter44.html
```

---

# 8. 판정 기준

|결과|설명|
|-|-|
|PASS|프로젝트 웹폰트가 정상적으로 적용된 경우|
|WARNING|등록되지 않은 시스템 폰트가 렌더링된 경우|
|FAIL|웹폰트 로딩 실패 또는 검사 오류 발생|

---

# 9. 폰트 검증 방식

Font Validation Tool은 다음 순서로 폰트를 검증합니다.

```
CSS font-family
        ↓
@font-face
        ↓
웹폰트 파일
        ↓
브라우저 실제 렌더링 폰트(PostScript Name)
```

단순 CSS 선언이 아닌 브라우저가 **실제 렌더링에 사용한 폰트(PostScript Name)** 를 확인한 후 @font-face에 등록된 **웹폰트 파일명**과 비교하여 웹폰트 적용 여부를 판정합니다.

---

# 10. 활용 예시

다음과 같은 상황에서 사용할 수 있습니다.

- HTML 변환 후 웹폰트 적용 여부 확인
- 다국어 문서 폰트 검증
- 신규 웹폰트 적용 QA
- 브라우저 Font Fallback 확인
- CSS 수정 후 폰트 영향도 확인

---

# 11. 참고 사항

- 출력되는 **CSS weight**는 HTML 요소에 적용된 `font-weight` 값을 의미합니다.
- 실제 폰트 파일명과 CSS `font-family` 이름이 달라도 동일한 웹폰트로 연결되는 경우 정상(PASS)으로 판정합니다.
- Unexpected Fallback이 발생하면 출력된 HTML 파일과 Selector를 확인하여 CSS 또는 웹폰트 설정을 점검하시기 바랍니다.
