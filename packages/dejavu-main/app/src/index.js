import React from 'react';
import { createRoot } from 'react-dom/client';
import { CrossStorageHub } from 'cross-storage';

import App from './App';

CrossStorageHub.init([
	{ origin: /\.appbase.io$/, allow: ['get'] },
	{ origin: /\.reactivesearch.io$/, allow: ['get'] },
	{ origin: /localhost:1359$/, allow: ['get'] },
	{ origin: /localhost:1358$/, allow: ['get'] },
]);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
