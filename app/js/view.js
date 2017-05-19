var View;

View = {
  init: function() {
    document.getElementById('task-list').addEventListener('click', function(event) {
        var clickedEl = event.target;
        if(clickedEl.tagName === 'INPUT') {
          console.log("Item checked:", clickedEl.checked);
          clickedEl.className = clickedEl.checked ? "checked": "";
          updateChecklist(clickedEl.dataset.id, clickedEl.checked);

        }
    });
  },
  getListItem: function(row) {
    var listItem = document.createElement('li');
    var id = "row-" + row.id;
    listItem.id = id;
    var checked = row.completed_at ? 'checked="checked"' : '';

    listItem.innerHTML = "<label>"
      + "<input type='checkbox' data-id=" + row.id + " value='on' " + checked + ">"
      + "<div class='check-circle'>"
      + "</div>"
      + "<span class='item-name'>"
        + row.name
      + "</span>"
    + "</label>";
    return listItem;
  }
}
