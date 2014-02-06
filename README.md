# Kraken Example: Sequelize and Bootstrap

"A Kraken (http://krakenjs.com/) example using sequelize.js connect MySQL, dust.js and Bootstrap 3.1"


## Running this example

Clone this repo: `git clone https://github.com/KorinahSalleh/Kraken_Example_Sequelize_Boostrap.git`

Install the dependencies: `npm install`

Start the server: `npm start` and visit a page http://localhost:8000

## Prerequisites
* This example requires that MySQL is installed.
* You will --of course-- need [Node](http://nodejs.org) (Version >= 0.10.20 preferred)

## Adding DB configuration
Update the following db credentials to `./config/app.json`:
```json
    "databaseConfig": {
        "host": "localhost",
        "database": "test",
        "username":"root",
        "password":"",
        "options": {
                "host": "localhost",
                "port": "3306",
                "dialect": "mysql"
            }
    }
```

To create tables, Open the `.models/index.js`: Uncomment line 61 - 71


## Sequelize js with Express
* http://sequelizejs.com/articles/express
* https://github.com/sequelize/sequelize-expressjs-example

## Note
I'm still working on to add the Login section
If you find any typos, errors, bugs or you have suggestions for improvement, please feel free to open an issue.


