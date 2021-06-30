# 暨大搶便當網站
## 為什麼我們想做這個
免費便當是我最愛的東西，如果能夠不用每天盯著學校網站的活動網站，那該有多好~


## 使用資源
- 前端
    - React
    - Firebase auth
    - react testing library
- AWS 虛擬機
    - 完整的 ubuntu server 20.04
    - micro-k8s
- 後端
    - flask
    - firebase-sdk
    - selenium

## 實作過程
1. 前端把 firebase 當成驗證伺服器
2. 傳送 JWT 給後端 ( flask )
3. 後端利用 JWT parse 成 userId( firebase-sdk ) ，加密學校帳戶的密碼
4. 後端 selinium 控制 chrome 去操作學校活動預約網站( 預約 或 取消預約 )


## micro k8s & gitlab runner
1. 安裝snap (一個軟體部署和軟體套件管理系統)
`sudo apt update`
`sudo apt install snapd`
`sudo apt install snapcraft` 
1. 安裝 microk8s
`sudo snap install microk8s --classic` 
2. 要先把使用者加入群組才可以使用 microK8s (記得重開機)
`sudo usermod -a -G microk8s $USER`
`sudo chown -f -R $USER ~/.kube` 
`sudo reboot`
2. 啟用 helm3 (管理 k8s 裡設定檔的一個工具)
`microk8s.enable helm3` 
3. 設定簡寫
`alias helm=microk8s.helm3` 
4. 創建一個 namespace "gitlab"
`microk8s.kubectl create ns gitlab` 
5. add chart repo
`helm repo add gitlab https://charts.gitlab.io` 
6. 創建一個設定檔 [default yaml](https://gitlab.com/gitlab-org/charts/gitlab-runner/blob/main/values.yaml)
`vim values.yaml` 
    - config values file 
        - 以下兩項必填，可以在 gitlab repo 的 setting -> CICD -> runner 找到
        - `gitlabUrl`
        - `runnerRegistrationToken`
7. 安裝 runner
`helm install --namespace gitlab gitlab-runner -f ./values.yaml gitlab/gitlab-runner` 
    - `# helm install --namespace [namespace] [release name] -f [config values file] gitlab/gitlab-runner`
    
8. 列出所有 namespace 底下的 pods, services 等
`microk8s.kubectl get all --all-namespaces` 



> 要記得把 "Gitlab / Setting / CICD / Runner / Enable shared runners for this project" 的選項關閉，否則就算你有自己架 runner，gitlab 似乎會優先認為你要用 shared runner。


> ##### 若要刪除 runner
> - `helm delete --namespace gitlab gitlab-runner`
>     - `# helm delete --namespace [namespace] [release name]`

            
            
### 前端
#### firebase 設定
1. 開啟 firebase 新專案
![](https://i.imgur.com/KFZSQGv.png)
2. enable firebase 驗證功能
    - ![](https://i.imgur.com/8U5rXRl.png)
- 啟用 firebase 專案
    - ![](https://i.imgur.com/NCPihyK.png)

3. 取消 localhost 授權網域
    - ![](https://i.imgur.com/4jM9OVx.png)
    :::info
    主要防止別人透過 localhost 跟我們的 firebase 驗證伺服器溝通
    :::
4. 添加測試帳號
    - ![](https://i.imgur.com/Q6XfQhT.png)
5. 添加 web ( firebase )
    - ![](https://i.imgur.com/5DhzVBv.png)
    - ![](https://i.imgur.com/pIpsULX.png)
        名字你開心取什麼就甚麼
    - ![](https://i.imgur.com/9Mw99wk.png)
        記住這些值，這些是要寫到前端和後端的認證所需資訊
    - 為 React 使用 firebase 驗證添加這些 local variable( 開頭都已 REACT_APP 開頭 ) ， 後面都要包含我們的認證所需資訊( 上一步產生的 key )
    ![](https://i.imgur.com/BqmV7k8.png)
    
### 後端
#### selenium
> 模擬使用者操作

- 處理 user 及 events 的 CRUD
- 將首頁需要的資料，先透過 JWT 辨識當下使用者，再將資料庫裡屬於該使用者的資料抓出來
- 當使用者按下預約或取消按鈕的時候，在伺服器端使用 selenium 自動操作報名介面
- 定時爬活動資訊
#### 爬蟲
> 由於學期結束，活動報名網站已無活動，故無法爬到任何東西，請關注後續更新

