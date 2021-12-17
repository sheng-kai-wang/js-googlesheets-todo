# 用 Google Sheets 當作資料庫
> 透過 JavaScript + Google Apps Script 

## 使用說明
### Google Apps Script
1. 建立 Google Sheets
2. 點選 `擴充功能` > `Apps Script` 建立專案
3. 修改專案名稱
4. 貼上 code.gs 所有內容，並依照自身需求修改程式內容。
5. 儲存後，點選 `部署` > `新增部署作業` > `齒輪圖示` > `網頁應用程式`
6. 新增說明內容，點選 `誰可以存取` > `所有人` >  `部署`
7. 點選 `授予存取權`，登入帳號，點選 `允許`
8. 複製 網頁應用程式網址，並保存下來

### JavaScript
1. 打開 index.html
2. 將 scriptURL 取代為剛才的 網頁應用程式網址
3. 運行 index.html 即可正常使用