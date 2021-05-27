---
title: Logging
---

## 
> A good logging strategy ensures that your logs are structured as carriage-return separated JSON blocks. This makes it easy for modern log repositories and viewers like LogDNA, Kibana, and Loggly to sort and filter various keywords in the JSON block. Even though modern logging repositories will turn string-based logs into JSON logs internally, providing JSON logs allows your applications to define their own custom keywords to sort/search with. It’s still common for shell scripts at the startup of a container to not use JSON logs, but to have a Node.js process in the same container use JSON logging after startup.
[source](https://developer.ibm.com/languages/node-js/blogs/nodejs-reference-architectire-pino-for-logging/)
