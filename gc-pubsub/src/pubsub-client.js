'use strict';

const PubSub = require('@google-cloud/pubsub');

exports.init = ({ projectId, keyFilename }) => {
	const projectConf = projectId && keyFilename
		? { projectId, keyFilename }
		: undefined;

	return exports.PubSubClient = PubSub(projectConf);
};
