# 產生測試簡單憑證 (HTTPS/TLS)

- 使用工具：openssl

## 過程
```
# 產生簡單 root 金鑰，這裡無選擇特殊加密
openssl genrsa -out key.pem 2048

# 產生 request
openssl req -new -key key.pem -out csr
>TW
>Taiwan
>Taipei
>lightyen
>lightyen
>localhost
>[]
>[]
>[]

# 產生有效期限十年的憑證
openssl x509 -req -days 3650 -in csr -signkey key.pem -out root.crt

# 刪除不用的 request
rm -f csr

# 產生 server 金鑰
openssl genrsa -out server.pem 2048

# 產生 request
openssl req -new -key server.pem -out csr

# 產生 server 憑證 by root key
openssl x509 -req -days 3650 -extensions v3_req -CA root.crt -CAkey key.pem -CAserial root.srl -CAcreateserial -in csr -out server.crt
``` 
- 瀏覽器要通過驗證須匯入 root.crt
- 以上金鑰都沒加密，加密需要修改go程式碼使其可以解密