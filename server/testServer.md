## Tests using Postman - Gogo

TODO: Cards - authorisation of certain paths - user can read but only trainer/manager can edit
TODO: Add logger middleware


#1 - Initial Setup
TODO: FIX error when authorisation token is sent in Header
+ POST 	- /settings/admin - {"email": "georgi.karchev@gmail.com", "password": "123123" } <- Create Admin
+ PUT 	- /settings/admin -> {"email": "georgi.karchev@gmail.com", "password": "123123" } <- Change Admin with the user who has the specified email. If no user with that email is found create a new user with that email and password and set him as Admin.


#2 - Authentication
+ POST 	- /auth/login - {"usernameOrEmail": "georgi.karchev@gmail.com", "password": "123123" } 
-> returns token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDBhZTRhNWI5ZGQxYzg3N2EzODI3M2UiLCJlbWFpbCI6Imdlb3JnaS5rYXJjaGV2QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiQWRtaW4iLCJleHBpcmVzIjoiMjAyMy0wNC0xMFQwNzowNzo1My45OTFaIiwiaWF0IjoxNjc4NDM1NjczfQ.IzDvfbNP9ru1Oreus3o-wlO0pj0d1QaQRiDrH_sM6No


#3 - Managers/Trainers/Clients - "managers", "/users", "/trainers"
+ GET 		- /managers/ -> return first 20 managers orderedBy Id
+ GET 		- /managers?limit=20&skip=0&sortBy=name&orderBy=asc
+ POST		- /managers/ -
					
					(1) Create a new user with a unique email
							-> {"email": "nachkata@gmail.com", "password": "123123"}
					
					(2) Create a new user with a unique username
							-> {"username": "Valentina", "password": "123123" }

+ GET 		- /managers/:id - manager profile

+ PUT			-	/managers/:id/username												-> { "username" : "nachkata@gmail.com" }
+ PUT			-	/managers/6408629c8a8acfa87c1e2352/email			-> { "email" : "nachkata@gmail.com" }
+ PUT			-	/managers/:id/password												-> { "password" : "123456" }
- PUT			-	/managers/:id/image														-> { "image" : "nachkata@gmail.com" }	
+ PUT			-	/managers/:id/name														-> { "name" : "Nackata" }	
+ PUT			-	/managers/:id/phone														-> { "phone" : "0883401128" }	
+ PUT			-	/managers/:id/target													-> { "target" : "Become the best manager!" }	
+ PUT			-	/managers/:id/food-regime											-> { "foodRegime" : "Manager's food regime" }	
+ PUT			-	/managers/:id/notes														-> { "notes" : "Manager's notes" }
+ PUT			-	/managers/:id/status													-> { "active" : "false" }	

#4 - Clients
- GET 		- /users/ -> return first 20 users orderedBy Id
- GET 		- /users?limit=20&skip=0&sortBy=name&orderBy=asc
- POST		- /users/ -
		(1) - {"email": "nachkata@gmail.com", "password": "123123", "creator": "6406fdcfc9bf370beada960c" }
		(2) - {"username": "Valentina", "password": "123123", "creator": "6406fdcfc9bf370beada960c" }
- GET 		- /users/:id - manager profile
- DELETE - /users/:id -> returns the deleted user


#5 - Cards
creator

+ GET			-	/clients/:id/cards?limit=100&skip=0&sortBy=id&orderBy=desc - last created 100 cards
+ GET			- /clients/:id/cards/:cardId - returns data for a single card
+ GET 		- /clients/:id/cards?owner=6412ded1ee8aa118a56a1cc9 <- get cards of a particular owner

+ POST		- /clients/:id/cards -> { "type" : "AlfaKarta", "start" : "2023-03-01T00:00:00.193+00:00", "end" : "2023-04-01T00:00:00.193+00:00", "trainingsLeft" : "20", "paid" : "true", "trainer" : "641234d6f1af71f9f50c9ece" }

+ PUT			-	/clients/:id/cards/:cardId/type												-> { "type" : "BetaKarta" }
+ PUT			-	/clients/:id/cards/:cardId/start											-> { "start" : "2023-03-01T00:00:00.193+00:00" }
+ PUT			-	/clients/:id/cards/:cardId/end												-> { "end" : "2023-04-01T00:00:00.193+00:00" }
+ PUT			-	/clients/:id/cards/:cardId/trainings-left							-> { "trainingsLeft" : "19" }
-- NOT TO BE PART OF THE API ------------ PUT			-	/clients/:id/cards/:cardId/owner											-> { "owner" : "641234f8f1af71f9f50c9ed7" }
+ PUT			-	/clients/:id/cards/:cardId/trainer										-> { "trainer" : "6412345d8121efe7c4f4032e" }
+ PUT			-	/clients/:id/cards/:cardId/notes											-> { "notes" : "Notes about this particular card" }
+ PUT			-	/clients/:id/cards/:cardId/paid												-> { "paid" : "false" }
+ PUT			-	/clients/:id/cards/:cardId/status											-> { "active" : "false" }
+ DELETE 	- /clients/:id/cards/:cardId
+ POST		-	/clients/:id/cards/:cardId/trainings										-> { "trainer" : "6412345d8121efe7c4f4032e", "date" : "2023-03-02T00:00:00.193+00:00" }
+ DELETE	-	/clients/:id/cards/:cardId/trainings/:trainingId										-> { "_id" : "64125131db331e7daa314255" }

Legacy
http://localhost:3030/cards?owner=6412ded1ee8aa118a56a1cc9


#5 - Measures


- POST URL /users/add/admin
{
	"email": "georgi.karchev@gmail.com",
	"password": "123123",
}


- POST URL / login
{
	"userNameOrEmail": "georgi.karchev@gmail.com",
	"password": "123123",
}




# Test using postman

* Client JSON
- POST URL example clients/507f1f77bcf86cd799439011/addClient
{
	"userName": "penka", 
	"password": "123123", 
	"image": "testImg", 
	"clientName": "Penka Lefterova", 
	"phoneNumber": "0888562", 
	"email": "penka@abv.bg", 
	"createDate": "26.02.2023", 
	"isActive": true, 
	"clientTarget": "da ima hubavo dupe", 
	"notes": "ne e marzeliva", 
	"foodRegime": "kartofiii"
}

* Manager JSON
- URL /registerManager
{
	"email": "stoyan@abv.bg", 
	"password": "123123", 
	"image": "testImgStyan", 
	"name": "Stoyan Dimitrov", 
	"phoneNumber": "0888562", 
	"createDate": "26.02.2023", 
	"target": "da gi ubie mega mnogo", 
	"notes": "gengsta shit 5000 klienti iska"
}

* Trainer JSON
- URL trainer/63fb01034534a627903f385a/addTrainer
{
	"userName": "niki@abv.bg", 
	"password": "123123", 
	"image": "testImgStyan", 
	"name": "Nikolai Stoianov", 
	"phoneNumber": "0888562", 
    "email": "niki@abv.bg",
	"createDate": "26.02.2023", 
	"target": "da gi ubie mega mnogo", 
	"notes": "gengsta shit 5000 klienti iska"
}


* Add card JSON
- URL clients/63fb01744534a627903f385d/addCard

{
	"type": "10 Trenings",
	"startDate": "2022-02-01",
	"endDate": "2022-03-01",
	"treningLeft": 10,
	"isPaid": "true",
	"isActive": "true"
}

* Add measures JSON
- URL clients/63fb01744534a627903f385d/addMeasures

{
	"date": "2022-02-01",
	"weight": 80,
	"neck": 30,
	"chest": 80,
	"waistAboveTheNavel": 65,
	"waistAboveNavel": 70,
	"waistUnderNavel": 60,
	"hans": 90,
	"thigh": 50

}