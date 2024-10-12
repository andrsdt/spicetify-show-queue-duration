// NAME: Show Queue Duration
// AUTHOR: andrsdt
// DESCRIPTION: Display how long is the current track queue

/// <reference path="../globals.d.ts" />

// HTML class of the queue page header. This may change
// from one version to another, so I'm adding them as they
// are added to Spotify. This is to ensure compatibility
// with older Spotify versions
const QUEUE_HEADER_SELECTORS = [
  ".main-type-canon",
  ".DG9CsoFIptJhAneKoo_F",
  ".queue-queuePage-header",
  ".mP6tR7IgjiamGqpBW5ai",
  ".vLZJk3f3zoMmc3u9QMrc > h1",
].join(", ");

(function ShowQueueDuration() {
	const queueHeader = document.querySelector(QUEUE_HEADER_SELECTORS);

	// Only run on the queue page
	if (Spicetify.Platform?.History?.location?.pathname !== "/queue" || !queueHeader) {
		setTimeout(ShowQueueDuration, 1000);
		return;
	}

	const queueText = queueHeader.textContent.split(" -")[0];
	
	const nextTracks = Spicetify.Queue?.nextTracks.filter(
		(t) => t.provider === "queue"
	);
	const queueDuration = nextTracks
		.map((t) => parseInt(t.contextTrack.metadata.duration) || 0)
		.reduce((a, b) => a + b, 0); // Sum up the durations

	const currentSongProgress = Spicetify.Player.getProgress() || 0;
	const currentSongDuration = Spicetify.Player.getDuration() || 0;
	const currentSongRemaining = currentSongDuration - currentSongProgress;

	const prettyDuration = new Date(queueDuration + currentSongRemaining)
		.toGMTString()
		.split(" ")[4]; // Index of "hh:mm:ss"

	queueHeader.textContent = queueText + `  -  ${prettyDuration}`;
	

	// Update every second
	setTimeout(ShowQueueDuration, 1000);
})();
