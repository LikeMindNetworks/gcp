'use strict';

const Subscriber = require('./subscriber');

exports.start = function() {
	const topicName = 'post_update';
	const subscriptionName = 'post_update_sub';
	const onReceivingMessage = function(message) {
		console.log('%s processing message %d', subscriptionName, message.id);
	};
	const postUpdateSubscriber = new Subscriber(
		topicName,
		subscriptionName,
		onReceivingMessage
	);

	return postUpdateSubscriber.subscribe()
		.then(() => postUpdateSubscriber.pull())
		.then(() => postUpdateSubscriber.registerOnReceivingMessage());
};
