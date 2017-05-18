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
}

function displayData() {
  // first clear the content of the task list so that you don't get a huge long list of duplicate stuff each time
  //the display is updated.
  var taskList = document.getElementById('task-list');
  var note = document.getElementById('notifications');

  taskList.innerHTML = '';

  // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
  var objectStore = db.transaction([STORE]).objectStore(STORE);
  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    // if there is still another cursor to go, keep runing this code
    if(cursor) {
      // create a list item to put each data item inside when displaying it
      var listItem = document.createElement('li');

      // build the to-do list entry and put it into the list item via innerHTML.
      listItem.innerHTML = cursor.value.name + ' — ' + cursor.value.due_date;

      // put the item item inside the task list
      taskList.appendChild(listItem);

      // create a delete button inside each list item, giving it an event handler so that it runs the deleteButton()
      // function when clicked
      var deleteButton = document.createElement('button');
      listItem.appendChild(deleteButton);
      deleteButton.innerHTML = 'X';
      // here we are setting a data attribute on our delete button to say what task we want deleted if it is clicked!
      deleteButton.setAttribute('data-task', cursor.value.id);
      deleteButton.onclick = function(event) {
        deleteItem(event);
      }

      // continue on to the next item in the cursor
      cursor.continue();

      // if there are no more cursor items to iterate through, say so, and exit the function
    } else {
      note.innerHTML += '<li>Entries all displayed.</li>';
    }
  }
}

function deleteItem(event) {
  // retrieve the name of the task we want to delete
  var dataTask = event.target.getAttribute('data-task');

  // open a database transaction and delete the task, finding it by the name we retrieved above
  var transaction = db.transaction([STORE], "readwrite");
  var request = transaction.objectStore("toDoList").delete(dataTask);

  // report that the data item has been deleted
  transaction.oncomplete = function() {
    // delete the parent of the button, which is the list item, so it no longer is displayed
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    note.innerHTML += '<li>Task \"' + dataTask + '\" deleted.</li>';
  };
};

function addData() {
  var note = document.getElementById('notifications');

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