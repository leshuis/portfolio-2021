var helpers = module.exports;

helpers.listOfLinks = function (items) {
    const itemType = Object.keys(items)[0];

    var out = "<ul>";

    console.log(itemType)
    for (let i = 0, l = items.length; i < l; i++) {

        
        console.log(items[i])
        out = out + "<li><a href='" + items[i].url + "'>" + items[i].text + "</a></li>";
    }

    return out + "</ul>";
}