'use strict';

const PubSubClient = require('./pubsub-client').PubSubClient;

class Publisher {
	constructor(topicName) {
		this.topicName = topicName;
	}

	publish(data) {
		return (
			this.topic
				? Promise.resolve([this.topic])
				: PubSubClient.topic(this.topicName)
					.get({ autoCreate: true })
			)
			.then(([topic]) => {
				this.topic = topic;

				return topic.publish(data);
			})
			.then(([messageIds]) => {
				console.log(`Message ${messageIds[0]} published.`);

				return messageIds;
			});
	}
}

module.exports = Publisher;
