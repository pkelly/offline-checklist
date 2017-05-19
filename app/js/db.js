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
var STORE = 'tasks';
var taskList, note;

window.onload = () => {
  var request = indexedDB.open('TestDatabase');
  request.onerror = function(evt) {
    console.log("Database error code: " + evt.target.errorCode);
  };

  request.onsuccess = function(evt) {
    db = request.result;
    displayData();
  };

  request.onupgradeneeded = function (evt) {
    var objectStore = evt.currentTarget.result.createObjectStore(
      "tasks",
      { keyPath: "id", autoIncrement: true }
    );
    addData();
  };

  taskList = document.getElementById('task-list');
  note = document.getElementById('notifications');
  View.init();
}

function displayData() {
  // first clear the content of the task list so that you don't get a huge long list of duplicate stuff each time
  //the display is updated.

  taskList.innerHTML = '';

  // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
  var objectStore = db.transaction([STORE]).objectStore(STORE);
  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    // if there is still another cursor to go, keep runing this code
    if(cursor) {
      // put the item item inside the task list
      taskList.appendChild(View.getListItem(cursor.value));

      // continue on to the next item in the cursor
      cursor.continue();

      // if there are no more cursor items to iterate through, say so, and exit the function
    } else {
      note.innerHTML += '<li>Entries all displayed.</li>';
    }
  }
}

function addData() {
  var note = document.getElementById('notifications');

  fetch(apiChecklist + '/tasks?filters=', myInit)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.tasks.forEach((task) => {
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

function updateChecklist(id, completed) {
  var payload = {
    application: "checklist-ui",
    completed: completed,
    id: id
  };

  var request = {
    method: 'PUT',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(payload)
  };
  if (navigator.onLine) {
    fetch(apiChecklist + '/tasks/' + id + '?application=checklists-ui', request).then(() => {
      console.log('live');
    });
  }
  else {
    console.log('cached');
  }

}