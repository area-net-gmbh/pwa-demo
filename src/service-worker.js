importScripts('./ngsw-worker.js');

self.addEventListener('notificationclick', (event) => {
  console.log('notification clicked!', event)
});

self.addEventListener('push', function(event) {
    console.log("PUSH-RECIEVED:", event);

    //self.registration.showNotification('Ein neuer Test', {});
    //event.waitUntil(new Promise(function () {}))

    event.waitUntil();
})


self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'todo-reminder') {
      // See the "Think before you sync" section for
      console.log("REMIDNER");
      event.waitUntil(showNotification());
    }
    // Other logic for different tags as needed.
});

function showNotification(){
    self.registration.showNotification(
        'physiomed Termin-Erinnerung',
        {
            body: 'Sie haben einen bevorstehenden Termin!'
        }
    );
}