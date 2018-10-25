# goblog

前後端都是初心者所撰寫的前後端實驗project。

## 如何開始

#### 安裝開發環境
- vscode
- golang (要配置GOPATH)
- nodejs
- yarn

#### 初始化開發環境
1. 用vscode打開此專案
2. 安裝go擴充套件
3. 按 `F1`，`>Go: Install/Update Tools` 安裝所有 golang tools
4. 按 `F1`，`>Run Task`
5. 選擇 **取得相依性套件(nodejs)** 下載套件
6. 選擇 **建置(webpack config)** 把typescript寫的設定檔編譯成javascript
7. 選擇 **建置(webpack development)** 把前端React打包經由webpack生成bundles
8. 按 `F5` 編譯 golang 後端代碼並啟動服務端調試
9. 瀏覽器網址輸入 `http://localhost:8080/` 看結果
10. 開始擼程式碼

* 前端開發更常使用的是 **監看(webpack)**，在前端代碼修改完後存檔時會立即自動編譯，以快速瀏覽該結果。

## 技術選擇

> ### Javascript framework

◾ Angular 2  
◾ Vue  
✔ React  

> ### React UI Components Library

◾ material-ui  
✔ ant-design  
◾ react-bootstrap  

> ### i18n

◾ react-i18next  
◾ react-intl  
✔ react-intl-universal  

> ### 偏好的程式語言

◾ javascript  
✔ typescript  

> ### 後端伺服器

◾ express (nodejs)  
✔ gin (golang)  

> ### 常用的編輯器

◾ vim  
◾ atom  
✔ vscode  

> ### 常用的瀏覽器

◾ Chrome  
◾ Microsoft Edge  
✔ Firefox Quantum  

## 常用的 vscode extensions
* Go
* npm Intellisense
* TSLint
* GitLens
* Material Icon Theme
* EJS language support
* Awesome Typescript Problem Matcher

## 常用的 Firefox extensions
* [react-devtools](https://addons.mozilla.org/zh-TW/firefox/addon/react-devtools/)

---

## 想做還沒做的部份
* 資料庫端(ex: mongodb)
* 前端狀態統一管理(ex: redux)
* 國際化語言i18n

## 常用參考連結
* [golang](https://golang.org/doc/)
* [antd](https://ant.design/components/button/)