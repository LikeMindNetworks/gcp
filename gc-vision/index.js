'use strict';

// credentials required if not running on GCP
const pubSubClient = require('@google-cloud/pubsub')();
const visionClient = require('@google-cloud/vision')();

/**
 * Background Cloud Function to be triggered by Pub/Sub.
 *
 * @param {object} event The Cloud Functions event.
 * @param {object} event.data Message from pubsub.
 * @param {string} event.data.data Message from pubsub NodeJS client in base64.
 * @param {string} event.data.data.imageUrl Image url to analyze.
 * @param {string} event.data.data.types Feature types to detect.
 * @param {string} event.data.data.publishTopic Pubsub topic to publish the results.
 * @returns {Promise}
 */
exports.imageProcessing = function imageProcessing(event) {
	// messages sent by calling cloud function and pubsub are different
	const pubsubMessage = event.data;
	const data = pubsubMessage.data
		? JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString()) // pubsub
		: pubsubMessage; // cloud function

	if (!data.imageUrl) {
		return Promise.reject('No image Url provided.');
	}

	if (
		data.imageUrl.substring(0, 7) !== 'http://'
			&& data.imageUrl.substring(0, 8) !== 'https://'
	) {
		return Promise.reject(
			'Only http(s) protocol is allowed for image source: ' + data.imageUrl
		);
	}

	if (data.types && !(Array.isArray(data.types) && data.types.length)) {
		return Promise.reject('Types must be a non-empty array.');
	}

	const types = data.types
		|| ['crops', 'text', 'faces', 'labels', 'safeSearch', 'similar'];

	return visionClient.detect(data.imageUrl, types)
		.then(([results]) => {
			if (data.publishTopic) {
				pubSubClient.topic(data.publishTopic).get({ autoCreate: true })
					.then(([topic]) => topic.publish(results))
					.then(([messageIds]) =>
						log(
							`Message ${messageIds[0]} published to ${data.publishTopic}.`
						)
					);
			}

			return results;
		});
};

const log = function() {
	if (process.env.NODE_ENV !== 'test') {
		return console.log(...arguments);
	}
};
