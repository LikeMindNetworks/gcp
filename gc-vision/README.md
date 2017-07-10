## Deploy vision as cloud function to Google Cloud
https://cloud.google.com/functions/docs/tutorials/pubsub

Steps:
1. Download Google Cloud SDK - https://cloud.google.com/sdk/docs/
2. Select or create a Cloud Platform project.
3. Enable billing for your project.
4. Enable the Vision, Cloud Functions and Cloud Pub/Sub APIs.
5. Run the following commands on a local machine.
```sh
# Update google cloud sdk
gcloud components update && gcloud components install beta

# Authenticate
gcloud auth application-default login

# Create a new Cloud Storage bucket for your function
gsutil mb -p [PROJECT_ID] gs://[BUCKET_NAME]

# Deploy the function in gc-vision directory
gcloud beta functions deploy imageProcessing \
	--stage-bucket [BUCKET_NAME] \
	--trigger-topic [TOPIC_NAME]

# Test/Trigger the function: Method 1
gcloud beta functions call imageProcessing \
	--data '{"imageUrl":"[URL]", "publishTopic": "[TOPIC_TO_PUBLISH_RESULTS]"}'

# Test/Trigger the function: Method 2
gcloud beta pubsub topics publish [TOPIC_NAME] \
	'{"imageUrl": "[URL]", "types": ["text", "labels", "safeSearch"], "publishTopic": "[TOPIC_TO_PUBLISH_RESULTS]"}'
```
