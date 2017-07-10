'use strict';

// Initialize google cloud pubsub client once
require('./pubsub-client').init({
	projectId: process.env.PROJECT_ID,
	keyFilename: process.env.KEY_FILENAME
});

const Publisher = require('./publisher');
const postUpdateSubscriber = require('./post-update-subscriber');
const postUpdate2Subscriber = require('./post-update-2-subscriber');

const subscribers = [postUpdateSubscriber, postUpdate2Subscriber];
subscribers.forEach((subscriber) => {
	subscriber.start();
});

// sample publish to cloud function with pub/sub
const imageProcessingPublisher = new Publisher('image_processing');
const data = {
	imageUrl: 'http://7bna.net/images/nice-wallpaper/nice-wallpaper-37.jpg',
	types: ['text', 'labels', 'safeSearch'],
	publishTopic: 'post_update'
};

setTimeout(() => imageProcessingPublisher.publish(data), 10000);
