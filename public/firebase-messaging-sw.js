// Manually append this code to the qop of service worker generated by npm build

importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
firebase.initializeApp({
  'messagingSenderId': '144595629077'
});
self.addEventListener('push', function(event) {
});

firebase.messaging().setBackgroundMessageHandler(function(payload) {
});