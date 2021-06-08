- https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
-
  ```js
  const encodedUriParams = p =>
    Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&")
  ```