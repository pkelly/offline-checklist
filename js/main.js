if(!'caches' in window) {
  alert('Uh noes! No Cache API');
}

caches.open('test-cache').then(function(cache) {
  cache.keys().then(function(keys) {
    if (keys.length) {
      console.log('Hit!!!!', cache);
    }
    else {
      cache.addAll(['/', '/css/app.css'])
        .then(function() {
          console.log('fetched and cached boss');
        });
    }
  });
});

caches.open('test-cache').then(function(cache) {
  cache.keys().then(function(cachedRequests) {
    console.log(cachedRequests); // [Request, Request]
  });
});

caches.open('test-cache').then(function(cache) {
  cache.match('/').then(function(matchedResponse) {
    console.log(matchedResponse);
  });
});

caches.open('test-cache').then(function(cache) {
  cache.match('/css/app.css').then(function(matchedResponse) {
    console.log(matchedResponse);
  });
});
