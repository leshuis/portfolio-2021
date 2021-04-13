
var helpers = module.exports;

helpers.list = function (items, attribute_name) {
    var out = "<ul>";

    console.log(">>",attribute_name)

    for (let i = 0, l = items.length; i < l; i++) {
        out = out + "<li>" + items[i][attribute_name] + "</li>";
    }

    return out + "</ul>";
}