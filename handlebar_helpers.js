var handlebars = require('gulp-compile-handlebars'),
    handlebar_variabels = require('./handlebar_vars.json'),
    dimensionOfImage = require('image-size');


handlebars.Handlebars.registerHelper("now", function () {
    return new Date().toLocaleString();
})

handlebars.Handlebars.registerHelper("capitals", function (str) {
    return str.toUpperCase();
})

handlebars.Handlebars.registerHelper("list", function (items, options) {
    var out = "<ul>";

    for (let i = 0, l = items.length; i < l; i++) {
        out = out + "<li>" + options.fn(items[i]) + "</li>";
    }

    return out + "</ul>";
})

handlebars.Handlebars.registerHelper("listOfLinks", function (items, options) {
    var out = "<ul>";

    for (let i = 0, l = items.length; i < l; i++) {
        out = out + "<li><a href='" + items[i]['link'] + "'>" + items[i]['text'] + "</a></li>";
    }

    return out + "</ul>";
})

handlebars.Handlebars.registerHelper("picture", function (url) {
    let measures = dimensionOfImage('./source/images/' + url);
    dimensionOfImage(url, function (err, dimensions) {
        return dimensions;
    })

    var str = '<picture>';
    var splitUrl = url.split(".");
    var base = handlebar_variabels.site[0].imagebase;
    str += "<source srcset='" + base + splitUrl[0] + "-300px." + splitUrl[1] + " 300w";
    str += "," + base + splitUrl[0] + "-500px." + splitUrl[1] + " 500w";
    str += "," + base + splitUrl[0] + "-700px." + splitUrl[1] + " 700w";
    str += "," + base + splitUrl[0] + "-900px." + splitUrl[1] + " 900w";
    str += "," + base + splitUrl[0] + "-1100px." + splitUrl[1] + " 1100w";
    str += "," + base + splitUrl[0] + "-1300px." + splitUrl[1] + " 1300w";
    str += "," + base + splitUrl[0] + "-1500px." + splitUrl[1] + " 1500w";
    str += "," + base + splitUrl[0] + "-1700px." + splitUrl[1] + " 1700w'>";
    str += "<source srcset='" + base + splitUrl[0] + "@1x." + splitUrl[1] + "'>";
    str += "<source srcset='" + base + splitUrl[0] + "@2x." + splitUrl[1] + "' 2x>";
    str += "<source srcset='" + base + splitUrl[0] + "@2x." + splitUrl[1] + "' 3x>";
    str += "<source srcset='" + base + splitUrl[0] + "@2x." + splitUrl[1] + "' 4x>";
    str += "<source type='image/webp' srcset='" + base + splitUrl[0] + "@1x.webp'>";
    str += "<source type='image/webp' srcset='" + base + splitUrl[0] + "@2x.webp 2x'>";
    str += "<source type='image/webp' srcset='" + base + splitUrl[0] + "@3x.webp 3x'>";
    str += "<source type='image/webp' srcset='" + base + splitUrl[0] + "@4x.webp 4x'>";
    str += "<img width='" + measures.width + "' height='" + measures.height + "' loading=lazy src='" + base + splitUrl[0] + "." + splitUrl[1] + "'>";
    str += '<picture>';
    return str;

})