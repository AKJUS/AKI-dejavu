// @flow

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Importer } from '@appbaseio/importer';

const ImporterPage = () => (
	<div>
		<Importer
			config={{
				sampleDataset: {
					url: '/samples/moviesData.json',
					label: 'Load sample movies',
					filename: 'movies.json',
				},
			}}
		/>
	</div>
);

export default ImporterPage;
