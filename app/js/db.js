var myHeaders = new Headers({
  'Content-Type':'application/json',
  'Accept':'application/json',
  'xo-session-token': 'cab74b0e725d1086ee05d982fe6fe7b1e00d1437089dedc5c1543c13f2c2024b'
});

var myInit = {
  method: 'GET',
  headers: myHeaders,
  mode: 'cors',
  cache: 'default'
};

var apiChecklist = 'https://qa-api.checklists.xogrp.com/wedding-checklist/api/v5';

var db;
var request = indexedDB.open('TestDatabase');
var note = document.getElementById('notifications');

request.onerror = function(evt) {
  console.log("Database error code: " + evt.target.errorCode);
};

request.onsuccess = function(evt) {
  db = request.result;
};

request.onupgradeneeded = function (evt) {
  var objectStore = evt.currentTarget.result.createObjectStore(
    "tasks",
    { keyPath: "id", autoIncrement: true }
  );
  addData();
};

function addData() {
  var STORE = 'tasks';
  fetch(apiChecklist + '/tasklist?application=', myInit)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.buckets[0].tasks.forEach((task) => {
        var transaction = db.transaction([STORE], "readwrite");

        // report on the success of opening the transaction
        transaction.oncomplete = function(event) {
          note.innerHTML += '<li>Transaction completed: database modification finished.</li>';
        };

        transaction.onerror = function(event) {
          note.innerHTML += '<li>Transaction not opened due to error. Duplicate items not allowed.</li>';
        };

        var objstore = transaction.objectStore(STORE);
        var objectStoreRequest = objstore.add(task);

        objectStoreRequest.onsuccess = function(event) {
          // report the success of our new item going into the database
          note.innerHTML += '<li>New item added to database.</li>';
        };

        // Return the mode this transaction has been opened in (should be "readwrite" in this case)
        transaction.mode;


      });
    });
}