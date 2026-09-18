We can Create Only 2 Api 
1) /create, 2) /feed

For Starting The Sereve Use :-
"npx nodemon server.js"

Multer => ye hum esh liye use karte hai ki hum api me jo data hai woh agar raw format me nahi hai form format me hai toh ushe read kar sake  sake
-> ye (app.js) file me jadatar use hota hai
-> npm i multer
-> multer({ storage: multer.memoryStorage() })

ImageKIT => Cloud Storage Provider
-> install code "npm install @imagekit/nodejs"
-> image ko cloud storage me rakhne ke liye
-> image ke buffer data ko ImageKIT me bhejenge or phir waha se same image ka Link ko get/lelenge aur ushko mongoDB server me store kara lenge



Services Folder => ye folder me jo file hai hum eshliye ye folder banate hai kyu jo bhi services nume permanent nahi use karna hota ushe hi esh folder me rakhte hai 

storage.service.js => esh file me hum imagekit ke liye code likh rahe hai ki kaise woh buffer data  lekar ushko link me badal ka dedega



Axios :- Eshka use karke hum frontend aur backend ko jodte hai
-> yah pe frontend aur backend ko jodte samay "CORS" ka bhi use hota hai
-> npm i axios - ye frontend me install karte hai


-> npm i cors - ye backend me install karte hai, ye allow karta hai frontend ki request ko jo backend apike liye hota hai, joki woh backend api se kuchh data ko request karta hai fronten me dikhane ke liye karta hai..