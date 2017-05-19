var View;

View = {
  init: function() {
    document.getElementById('task-list').addEventListener('click', function(event) {
        var clickedEl = event.target;
        if(clickedEl.tagName === 'INPUT') {
          View.updateState(clickedEl);
        }
    });
  },
  updateState: function(el) {
    var id = el.dataset.id;
    var row = document.getElementById("row-" + id);
    el.className = el.checked ? "checked": "";
    updateChecklist(id, el.checked);

    if (!navigator.onLine) {
      row.className = "pending";
    }
  },
  completedUpdate: function(id) {
    var row = document.getElementById("row-" + id);
    row.className = "updated";

    setTimeout(function() {
      row.className = "";
    }, 2000);
  },
  getListItem: function(row) {
    var listItem = document.createElement('li');
    var id = "row-" + row.id;
    listItem.id = id;
    var checked;
    var checkedClass;

    if (row.completed_at) {
      checked = 'checked="checked"';
      checkedClass = "checked";
    }

    if (row.pending) {
      listItem.className = "pending";
    }

    listItem.innerHTML = "<label>"
      + "<input type='checkbox' data-id=" + row.id + " value='on' " + checked + " class='" + checkedClass + "'>"
      + "<div class='check-circle'>"
      + "</div>"
      + "<span class='item-name'>"
        + row.name
      + "</span>"
    + "</label>";
    return listItem;
  }
}
