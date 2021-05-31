var helpers = module.exports;

helpers.list = function (dataItems, title = "") {
    const itemType = Object.keys(dataItems)[0];
    const items = dataItems[itemType];
    let item = null;

    var out = `<ul class='list list__clean'><h3 class="list__header">${title}</h3>`;

    for (let i = 0, l = items.length; i < l; i++) {
        item = items[i];
        out += '<li class="list_clean">';
        if (['social', 'skill', 'experience', 'education', 'course'].indexOf(itemType) >= 0) {

            out += `<ul class="${itemType} list__clean">`;
            for (const [key, value] of Object.entries(item)) {
                if (key == 'link') {
                    out += "<li><a href='" + value.url + "'>" + value.text + "</a></li>";
                } else {
                    out += `<li class="${itemType}__${key}">${value}</li>`;
                }
            }
            out += '</ul>'
        }
        out += '</li>';
    }

    return out + "</ul>";
}