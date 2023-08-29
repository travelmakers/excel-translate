# 다국어번역을 위한 Translate API 사용법

1. excel -> json 변환시
- 엑셀 파일을 json로 변환시키기 위해서는 `excelFilesFolder`에 변환시킬 excel 파일들을 넣어줍니다.
- `yarn excelToJson` 스크립트 실행
- `output` 폴더에 변환된 json 파일들이 생성됩니다. (en, ko폴더 단위로 만들어집니다.)

```bash
yarn && yarn excelToJson
```
 
2. json -> excel 변환시
- json 파일을 엑셀로 변환시키기 위해서는 `jsonFilesFolder`에 변환시킬 json 파일들을 넣어줍니다.
- `yarn jsonToExcel` 스크립트 실행
- `output` 폴더에 변환된 excel 파일들이 생성됩니다.

```bash
yarn && yarn jsonToExcel
```
