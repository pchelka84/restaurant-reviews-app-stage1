// based on https://www.youtube.com/watch?v=BfL3pprhnms&t=274s

var cacheName = 'v1';
var cacheFiles = [
    '/',
	'index.html',
	'css/styles.css',
	'restaurant.html',
	'js/dbhelper.js',
	'js/main.js',
	'js/restaurant_info.js',
	'img/1.jpg',
	'img/2.jpg',
	'img/3.jpg',
	'img/4.jpg',
	'img/5.jpg',
	'img/6.jpg',
	'img/7.jpg',
	'img/8.jpg',
	'img/9.jpg',
	'img/10.jpg'
]

self.addEventListener('install', e => {
	console.log("ServiceWorker Installed")
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			console.log("ServiceWorker Caching cacheFiles");
			return cache.addAll(cacheFiles);
		})
	)
})

self.addEventListener('activate', e => {
	console.log("ServiceWorker Activated")
	e.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(cacheNames.map(thisCacheName => {
				if (thisCacheName !== cacheName) {
					console.log("ServiceWorker Removing Cached Files from");
					return caches.delete(thisCacheName);
				}
			}))
		})
	)
});

self.addEventListener('fetch', e => {
	console.log('ServiceWorker Fetch', e.request.url);
	e.respondWith(
		caches.match(e.request)
			.then(response => {
				// If the request is in the cache
				if (response){
					console.log("ServiceWorker Found in Cache");
					return response;chrome
				}
				// Fetch and cache the request if it isn't in the cache
				var requestClone = e.request.clone();
				return fetch(requestClone)
					.then(function(response) {
						if (!response ){
							console.log("ServiceWorker No Response From fetch")
							return response;
						}
						var responseClone = response.clone(); 
						caches.open(cacheName).then(function(cache) {
							cache.put(e.request, responseClone);
							console.log("ServiceWorker New Data Cached"); 
							return response;
				        });
					})
					.catch(function(err) {
						console.log("ServiceWorker Error Fetching & Caching New Data");
					});
		})
	);
});