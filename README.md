# PC上での起動

## Google FontのSSL Error

* Next.js 16.0では以下で対応
```
set NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1
```

* Next.js 15以前では以下で対応
```
set NODE_TLS_REJECT_UNAUTHORIZED=0
```