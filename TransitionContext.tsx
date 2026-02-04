import React from 'react';

// true = page transition (delay animations)
// false = initial load (immediate animations)
export const TransitionContext = React.createContext<boolean>(false);
