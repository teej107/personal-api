/**
 * Created by tanner on 3/9/17.
 */
var express = require('express');
var bodyParser = require('body-parser');
var middleware = require('./controllers/middleware');
var mainCtrl = require('./controllers/mainCtrl');

var app = express();

app.use(bodyParser.json());
app.use(middleware.addHeaders);

app.listen(3000, function ()
{
    console.log("Starting nodejs...");
});

function get(path, callback, key = path.split('/')[0])
{
    var endpoint = function (req, res, next)
    {
        var value = callback ? callback(Object.assign({}, req.params, req.query), key, mainCtrl.user) : mainCtrl.user[key];
        res.send({
            [key]: value
        });
    };

    app.get('/' + path, endpoint);
}

get('name');
get('location');
get('occupations', function (params, key, user)
{

    if(params.order === 'asc')
        return user[key].slice().sort();
    if(params.order === 'desc')
        return user[key].slice().sort().reverse();

    return user[key];
});
get('occupations/latest', function (params, key, user)
{
    return user.occupations[user.occupations.length - 1];
}, 'latestOccupation');
get('hobbies');
get('hobbies/:type', function (params, key, user)
{
    return user[key].filter(function (hobby)
    {
        return hobby.type === params.type;
    });
});
get('family');
get('family/:gender', function (params, key, user)
{
    return user[key].filter(function (family)
    {
        return family.gender === params.gender;
    });
});
get('restaurants');

app.put('/name', function (req, res, next)
{
   var name = req.body.name;
   if(name)
   {
       mainCtrl.user.name = name;
   }
   res.send({ name: mainCtrl.user.name});
});

