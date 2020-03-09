import Fetch from '../utils/Fetch'

export default class Videos {
	async fetchPlaylist({apiKey, playlistId}) {
		try {
			const res = await Fetch.get(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails,snippet&maxResults=9`)
			return res
		} catch(e) {
			console.error(e)
			return false
		}
	}
	
	async init() {
		const apiKey = 'AIzaSyCQFwzDyaunRwLLXw5HmGbtzU7kcXCBCwc'
		const [featureVideoRes, playlistRes] = await Promise.all([this.fetchPlaylist({apiKey, playlistId:'PLPgiQYzddFtj1WFE-z8csoUBeWc6_ZqlZ'}), this.fetchPlaylist({apiKey, playlistId:'PLPgiQYzddFtiwHeR6XoCixKkVhVPhHP4z'})])
	
		const featureVideoId = featureVideoRes.items[0].snippet.resourceId.videoId
		document.querySelector('.js-feature-video').insertAdjacentHTML('beforeend', `
		<div class="embed-responsive embed-responsive--feature">
			<iframe class="embed-responsive__item" src="https://www.youtube.com/embed/${featureVideoId}?rel=0" allowfullscreen></iframe>
		</div>`)
	
		const playlistVideos = playlistRes.items
		playlistVideos.forEach((video) => {
			const id = video.snippet.resourceId.videoId
			document.querySelector('.js-playlist-videos').insertAdjacentHTML('beforeend', `
			<div class="column large-4 medium-6 small-12">
				<div class="box box--large">
					<div class="embed-responsive">
						<iframe class="embed-responsive__item" src="https://www.youtube.com/embed/${id}?rel=0" allowfullscreen></iframe>
					</div>
				</div>
			</div>
			`)
		})
	}
}