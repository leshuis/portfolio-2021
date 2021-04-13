var helpers = module.exports;

helpers.listOfLinks = function (items, attribute_name, attribute_link) {
    var out = "<ul>";

    for (let i = 0, l = items.length; i < l; i++) {
        out = out + "<li><a href='" + items[i][attribute_link] + "'>" + items[i][attribute_name] + "</a></li>";
    }

    return out + "</ul>";
}