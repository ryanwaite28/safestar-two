const tools = {};

/* --- */

tools.capitalize = function(string) {
  let str = string.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

tools.setActionButtonsDisabledState = function(boolean) {
  if(boolean === true){ $('.action-btn').attr("disabled", true); }
  if(boolean === false){ $('.action-btn').attr("disabled", false); }
}

tools.array_sort_by = function(array, property, direction) {
  let tempArray = array;
  tempArray.sort(function(a, b){
    var x = a[property].constructor === String && a[property].toLowerCase() || a[property];
    var y = b[property].constructor === String && b[property].toLowerCase() || b[property];
    let value = direction && String(direction) || "asc";
    switch(value) {
      case "asc":
        // asc
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      case "desc":
        // desc
        if (x > y) {return -1;}
        if (x < y) {return 1;}
        return 0;
      default:
        // asc
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    }
  });
  return tempArray;
}

/* --- */

Object.freeze(tools);
