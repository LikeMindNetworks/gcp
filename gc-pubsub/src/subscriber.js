'use strict';

const PubSubClient = require('./pubsub-client').PubSubClient;

class Subscriber {
	constructor(topicName, subscriptionName, onReceivingMessage) {
		this.topicName = topicName;
		this.subscriptionName = subscriptionName;
		this.onReceivingMessage = onReceivingMessage;
	}

	registerOnReceivingMessage() {
		if (this.subscription && this.onReceivingMessage) {
			this.onReceivingMessageWithAck = (message) => {
				this.onReceivingMessage(message);

				return message.ack(message.ackId);
			};

			this.subscription.on('message', this.onReceivingMessageWithAck);
		}
	}

	unregisterOnReceivingMessage() {
		if (this.subscription && this.onReceivingMessageWithAck) {
			this.subscription.removeListener('message', this.onReceivingMessageWithAck);
		}
	}

	subscribe() {
		let topic = PubSubClient.topic(this.topicName);

		return topic.get({ autoCreate: true })
			.then(([topic]) => topic.subscribe(this.subscriptionName))
			.then(([subscription]) => {
				console.log(`Subscription ${subscription.name} created.`);

				return this.subscription = subscription;
			})
			.catch(err => Promise.reject(err));
	}

	pull() {
		if (this.subscription) {
			return this.subscription.pull({ returnImmediately: true })
				.then(([messages]) => {
					console.log(`Received ${messages.length} messages from pulling.`);

					if (this.onReceivingMessage) {
						messages.forEach((message) => this.onReceivingMessage(message));
					}

					// Acknowledges received messages. If you do not acknowledge, Pub/Sub will
					// redeliver the message.
					return messages.length
						? this.subscription.ack(messages.map((message) => message.ackId))
						: [];
				});
		} else {
			return Promise.reject('Trying to pull messages without subscription');
		}
	}
}

module.exports = Subscriber;
