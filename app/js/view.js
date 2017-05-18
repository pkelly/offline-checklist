var View;

View = {
  getListItem: function(row) {
    var listItem = document.createElement('li');
    var id = "row-" + row.id;

    listItem.innerHTML = "<label for=" + id + ">"
      + "<input type='checkbox' id='" + id + "' value='on'>"
      + "<div class='check-circle'>"
      + "</div>"
      + "<span class='item-name'>"
        + row.name
      + "</span>"
    + "</label>";
    return listItem;
  }
}