// MUST import synthetic shadow BEFORE any LWC imports.
import '@lwc/synthetic-shadow';

// Load app bootstrap only after synthetic shadow patches runtime globals.
await import('./bootstrap.js');
