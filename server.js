var http = require('http');
var fs = require('fs');
var qs= require('querystring');
var server = http.createServer();

server.on('request', function(req,res){ 

    //console.log(req.url)
    if(req.method=='GET'){
        if(req.url === "/"){
            fs.readFile('form.html',function(err,data){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }
        else if (req.url =='/data/users.json'){
            fs.readFile('./data/users.json', function(err, data) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(data);
                res.end();
            });
        }
        else if(req.url =='/users.html'){
            fs.readFile('./data/users.json', function (err, data) {
                    if (err) throw err;

                    var obj = JSON.parse(data);
                   
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write("<table border=1>");
                    res.write("<tr>");
                    res.write("<th>Fname</th>");
                    res.write("<th>Lname</th>");
                    res.write("<th>Birthday</th>");
                    // for (i=0;i<emailLength+3;i++){
                    res.write("<th>Email</th>");
                    // }
                    for (i=0;i<obj.length;i++){
                        res.write("<tr>")
                        res.write("<td>"+obj[i].fname + '</td>');
                        res.write("<td>"+obj[i].lname+'</td>');                       
                        res.write("<td>"+obj[i].birthday+'</td>');
                        res.write("<td>"+obj[i].email+'</td>');
                        res.write("</tr>")
                    }
                    res.end();
                });

        }
        else{
            res.writeHead(404);
            res.write('404 Error');
            res.end()
        };
    }
    else if(req.method=='POST'){
        // collect data 
        var body = [];
        req.on('data',(chunk)=>{
            body.push(chunk);
        });
        req.on('end',()=>{
            body = Buffer.concat(body).toString();
            console.log(body);
            res.end();


            var user_num = body.split('fname').length - 1;
            var users = [];
            var post = qs.parse(body);
            for (var i = 0; i<user_num ;i++){
                var j = i+1;
                var temp = {'fname':post['fname-'+j],'lname':post['lname-'+j],'birthday':post['birthday-'+j],'email':post['email-'+j]};
                console.log(temp);
                users[i]=temp;
            }

            var json = JSON.stringify(users);
            if(!fs.existsSync('./data/users.json')){
                fs.openSync('./data/users.json', 'w');
                fs.writeFileSync('./data/users.json',json);

            }else{    
            
            fs.readFile('./data/users.json','utf8',function callback(err,data){
                var obj = JSON.parse(data);
                obj = obj.concat(users);
                var json = JSON.stringify(obj);
                fs.writeFileSync('./data/users.json',json);

            });
            }
            res.end();
        });

        

    }
    else{
        res.writeHead(404);
            res.write('404 Error');
            res.end()
    }

    
});

server.listen(20246);
console.log('Listening port 20246');

