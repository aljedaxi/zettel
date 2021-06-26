- if you have something that isn't important, try doing the following:
  
  ```js
  import { startTransition } from 'react'
  
  const [searchQuery, setSearchQuery] = useState ()
  
  startTransition(_ => {
    setSearchQuery(input);
  });
  ```
  
  it means the update can be interrupted by something more important
- https://blog.asayer.io/the-definitive-guide-to-profiling-react-applications