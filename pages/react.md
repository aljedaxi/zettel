- if you have something that isn't important, try doing the following:
  
  ```
  
  ```
- import { startTransition } from 'react';
- // Urgent: Show what was typed
  setInputValue(input);
- // Mark any state updates inside as transitions
  startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
  });