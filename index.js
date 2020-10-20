const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
// let morgan = require('morgan');
let bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./Router');

const selectAll = `SELECT can.* ,
breed.breed,

case when elig.pet_ID is null and alteration_status=true then 'adoptable'
     else 'not adoptable'
end adoptability 
FROM 
(SELECT ani.pet_ID as pet_ID,
 animal_name,
 species_type,
 sex,
 alteration_status,
 age 
FROM 
(SELECT pet_ID, 
 animal_name,
 species_type,
 sex,
 alteration_status,
 age from Animal) ani
LEFT JOIN (select pet_ID from adoption) adopt
ON ani.pet_ID=adopt.pet_ID
WHERE adopt.pet_ID is null) can

LEFT JOIN 

(SELECT animal.pet_ID FROM 

(SELECT ani.pet_ID as pet_ID ,
 ani.species_type as species_type,
adopt.pet_ID as adopt_petID,
alteration_status
FROM 
(SELECT pet_ID, species_type,alteration_status from Animal) ani
LEFT JOIN (select pet_ID from adoption) adopt
ON ani.pet_ID=adopt.pet_ID
WHERE adopt.pet_ID is null and alteration_status=true) animal
JOIN 
(SELECT species_type ,vaccine_name from vaccinetypes
Where required_for_adoption=true ) req
ON animal.species_type=req.species_type
LEFT JOIN (SELECT pet_ID, vac_type from vaccination
group by 1,2 ) vac
ON animal.pet_ID = vac.pet_ID and req.vaccine_name=vac.vac_type
WHERE vac_type is null
GROUP BY animal.pet_ID) elig
ON can.pet_ID=elig.pet_ID
LEFT JOIN 
(SELECT pet_ID,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name
ASC SEPARATOR '/') as breed
FROM animalspeciesbreeds
GROUP BY pet_ID) breed
ON can.pet_ID=breed.pet_ID`;

let vaccinereminderquery = 'SELECT vac.pet_ID as pet_ID, vac_type, exp_date, user.last_name as recorder_last_time, \
    user.first_name as recorder_first_time, species_type, breed, sex, alteration_status, microchip_ID, surrender_date \
    FROM \
    (SELECT pet_ID, vac_type,exp_date,user_name \
    FROM Vaccination \
    WHERE TIMESTAMPDIFF(month, CURRENT_DATE,exp_date) <=3 and TIMESTAMPDIFF(day,CURRENT_DATE,exp_date) >=0)vac\
    JOIN (\
    SELECT a.pet_ID as pet_ID,a.species_type as species_type, breed, sex, alteration_status, microchip_ID, surrender_date \
    FROM animal a \
    LEFT JOIN (SELECT pet_id, GROUP_CONCAT(DISTINCT breed_name ORDER BY  breed_name ASC SEPARATOR "/") as breed \
    FROM AnimalSpeciesBreeds \
    GROUP BY 1) b \
    ON a.pet_ID=b.pet_ID) an \
    ON vac.pet_ID=an.pet_ID \
    LEFT JOIN (SELECT user_name, last_name, first_name \
        FROM `User`) user \
    ON vac.user_name=user.user_name \
    ORDER BY exp_date, pet_ID '

    let getCapacity = `SELECT
    a.species_type AS species_type,
    a.MaxNumber-b.current_count AS capcatiy
    FROM
    species a
    JOIN (
    SELECT
      species_type,
      COUNT(DISTINCT ani.pet_ID ) AS current_count
    FROM
      Animal ani
    LEFT JOIN (
      SELECT
        pet_ID
      FROM
        adoption) adopt
    ON
      ani.pet_ID=adopt.pet_ID
    WHERE
      adopt.pet_ID IS NULL
    GROUP BY
      1) b
    ON
    a.species_type=b.species_type`

    let monthadoptreportquery = `SELECT t1.year as year,t1.month as month, t1.species_type as species_type , t1.breed as breed ,COALESCE(adoption_count,0) as adoption_count, COALESCE(surrender_count,0) as surrender_count \
    FROM (SELECT YEAR(surrender_date) as year, MONTH(surrender_date) as month, br.species_type as species_type, breed, count(*) as surrender_count FROM Animal an \
    JOIN (select pet_ID, species_type,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed FROM AnimalSpeciesBreeds \
    GROUP BY 1,2) br ON an.pet_ID=br.pet_ID WHERE TIMESTAMPDIFF(day, an.surrender_date, CURRENT_DATE) <= 365 AND TIMESTAMPDIFF(day, an.surrender_date, CURRENT_DATE) > 0  GROUP BY 1,2,3,4) t1 \
    LEFT JOIN (SELECT YEAR(adoption_date) as year, MONTH(adoption_date) as month, br.species_type as species_type, breed, count(*) as adoption_count FROM Adoption ap \
    JOIN (select pet_ID, species_type,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed FROM AnimalSpeciesBreeds \
    GROUP BY 1,2) br ON ap.pet_ID=br.pet_ID WHERE TIMESTAMPDIFF(day, ap.adoption_date, CURRENT_DATE) <= 365 AND TIMESTAMPDIFF(day,  ap.adoption_date, CURRENT_DATE) > 0 GROUP BY 1,2,3,4) t2 \
    ON t1.year=t2.year AND t1.month=t2.month AND t1.species_type=t2.species_type AND t1.breed=t2.breed UNION \
    SELECT t4.year as year, t4.month as month, t4.species_type as species_type, t4.breed as breed, COALESCE(adoption_count,0) as adoption_count,COALESCE(surrender_count,0) as surrender_count \
    FROM (SELECT YEAR(surrender_date) as year, MONTH(surrender_date) as month, br.species_type as species_type, breed, count(*) as surrender_count FROM Animal an \
    JOIN (select pet_ID, species_type,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed FROM AnimalSpeciesBreeds GROUP BY 1,2) br \
    ON an.pet_ID=br.pet_ID WHERE TIMESTAMPDIFF(day, an.surrender_date, CURRENT_DATE) <= 365 AND TIMESTAMPDIFF(day, an.surrender_date, CURRENT_DATE) > 0 \
    GROUP BY 1,2,3,4) t3 RIGHT JOIN  (SELECT YEAR(adoption_date) as year, MONTH(adoption_date) as month, br.species_type as species_type, breed, count(*) as adoption_count \
    FROM Adoption ap JOIN (select pet_ID, species_type,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed FROM AnimalSpeciesBreeds \
    GROUP BY 1,2) br ON ap.pet_ID=br.pet_ID  WHERE TIMESTAMPDIFF(day, ap.adoption_date, CURRENT_DATE) <= 365 AND TIMESTAMPDIFF(day,  ap.adoption_date, CURRENT_DATE) > 0 \
    GROUP BY 1,2,3,4) t4 ON t3.year=t4.year AND t3.month=t4.month AND t3.species_type=t4.species_type AND t3.breed=t4.breed union \
    select year, month, species_type, "---------Month_Species_SUBTOTAL---------", sum(adoption_count) as adoption_count, sum(surrender_count) as surrender_count  from \
    ( SELECT t1.year as year,t1.month as month, t1.species_type as species_type , t1.breed as breed ,COALESCE(adoption_count,0) as adoption_count, COALESCE(surrender_count,0) as surrender_count \
    FROM (SELECT YEAR(surrender_date) as year, MONTH(surrender_date) as month, br.species_type as species_type, breed, count(*) as surrender_count FROM Animal an \
    JOIN (select pet_ID, species_type,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed FROM AnimalSpeciesBreeds GROUP BY 1,2) br \
    ON an.pet_ID=br.pet_ID WHERE TIMESTAMPDIFF(day, an.surrender_date, CURRENT_DATE) <= 365 AND TIMESTAMPDIFF(day, an.surrender_date, CURRENT_DATE) > 0 GROUP BY 1,2,3,4) t1 \
    LEFT JOIN (SELECT YEAR(adoption_date) as year, MONTH(adoption_date) as month, br.species_type as species_type, breed, count(*) as adoption_count FROM Adoption ap \
    JOIN (select pet_ID, species_type,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed  FROM AnimalSpeciesBreeds \
    GROUP BY 1,2) br ON ap.pet_ID=br.pet_ID WHERE TIMESTAMPDIFF(day, ap.adoption_date, CURRENT_DATE) <= 365 AND TIMESTAMPDIFF(day,  ap.adoption_date, CURRENT_DATE) > 0 GROUP BY 1,2,3,4) t2 \
    ON t1.year=t2.year AND t1.month=t2.month AND t1.species_type=t2.species_type AND t1.breed=t2.breed  UNION \
    SELECT t4.year as year, t4.month as month, t4.species_type as species_type, t4.breed as breed, COALESCE(adoption_count,0) as adoption_count,COALESCE(surrender_count,0) as surrender_count \
     FROM (SELECT YEAR(surrender_date) as year, MONTH(surrender_date) as month, br.species_type as species_type, breed, count(*) as surrender_count \
     FROM Animal an JOIN (select pet_ID, species_type,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed \
    FROM AnimalSpeciesBreeds  GROUP BY 1,2) br  ON an.pet_ID=br.pet_ID WHERE TIMESTAMPDIFF(day, an.surrender_date, CURRENT_DATE) <= 365  AND TIMESTAMPDIFF(day, an.surrender_date, CURRENT_DATE) > 0 GROUP BY 1,2,3,4) t3 \
    RIGHT JOIN (SELECT YEAR(adoption_date) as year, MONTH(adoption_date) as month,  br.species_type as species_type, breed, count(*) as adoption_count \
     FROM Adoption ap JOIN (select pet_ID, species_type,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed FROM AnimalSpeciesBreeds \
    GROUP BY 1,2) br ON ap.pet_ID=br.pet_ID WHERE TIMESTAMPDIFF(day, ap.adoption_date, CURRENT_DATE) <= 365 AND TIMESTAMPDIFF(day,  ap.adoption_date, CURRENT_DATE) > 0  \
    GROUP BY 1,2,3,4) t4 ON t3.year=t4.year AND t3.month=t4.month AND t3.species_type=t4.species_type AND t3.breed=t4.breed  ORDER BY 1,2,3,4 ) table_all \
  group by year, month, species_type ORDER BY 1,2,3,4; `
   

    const SELECT_App_ContactInfo_Query = `SELECT acation.app_ID,acant.first_name,acant.last_name,acation.co_applicant_first_name, acation.co_applicant_last_name,
acant.street,acant.city,acant.state,acant.zipcode,acant.phone,acant.email,acation.app_date FROM Applicant acant
JOIN Application acation
on acation.applicant_email =acant.email
order by acation.app_ID`;

app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const connection = mysql.createPool({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b005dee671132d',
    password: '92cd09e9',
    database: 'heroku_8307b58b0a6de8c',
    multipleStatements: true,
    dateStrings: 'date'
});

// connection.connect(err => {
//     if (err) {
//         return err;
//     }
// });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, connection);

app.use(session({
    key:'fhi382864hoffjsjdf9w8ehhs',
    secret:'fh27r3hfhdb4910r800fdshufemcn',
    store: sessionStore,
    resave:false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));

new Router(app, connection);

app.get('/', function(req, res) {
    // res.send('hello from the animals server. Go to /animals to see animals');
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.get('/VacReminder', (request, response)=>{
    connection.query(vaccinereminderquery, (err, results)=> {
        if(!err)
            return response.json({data: results});
        else
            console.log(err)
        })
    })

app.get('/MonthAdoptReport', (request, response)=>{
    connection.query(monthadoptreportquery, (err, results)=> {
        if(!err)
            return response.json({data: results});
        else
            console.log(err)
        })
    })
let volsearchquery = "SELECT a.first_name as first_name, \
a.last_name as last_name, a.email as email, b.Phone as Phone FROM User a  \
JOIN Volunteer  b  \
ON a.user_name=b.user_name  \
ORDER BY last_name, first_name " ;

app.get('/VolLookup', (request, response)=>{
    connection.query(volsearchquery, (err, results)=> {
        if(!err)
            return response.json({data: results});
        else
            console.log(err)
        })
    })

app.get('/home', (req, res) => {
    res.send('hello from the animals server. Go to /animals to see animals');
});

app.get('/animals', (req, res) => {
    res.send("please log in first");
});

app.get('/api/animals', (req, res) => {
    connection.query(selectAll, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json (
                {data: results}
            );
        }
    });
});

app.get('/capacity', (req, res) => {
    connection.query(getCapacity, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json (
                {data: results}
            )
        }
    });
});

app.get('/:petid/vaccination', (req, res) => {
    const petid = req.params.petid;
    console.log(petid);
    const VAC_QUERY = `select * from vaccinetypes 
    where vaccinetypes.vaccine_name not in 
    (SELECT distinct vaccination.vac_type FROM vaccination 
    where pet_ID='${petid}' and vaccination.exp_date > now());
    `;
    connection.query(VAC_QUERY, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            // console.log(results);
            return res.json (
                {data: results}
            )
        }
    });
});

app.get('/animal/:petid', (req, res) => {
    const petid = req.params.petid;
    console.log(petid);
    const INSERT_ANIMAL_QUERY = `SELECT Animal.pet_ID as pet_ID, animal_name, microchip_ID, description, alteration_status, sex, age, surrender_reason, surrender_date, by_animal_control, user_name,species_type,breed FROM Animal JOIN ( SELECT pet_ID,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed FROM AnimalSpeciesBreeds GROUP BY pet_ID) breed ON (Animal.pet_ID=breed.pet_ID AND Animal.pet_ID='${petid}')`;
    connection.query(INSERT_ANIMAL_QUERY, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            // console.log(results);
            return res.json (
                {data: results}
            )
        }
    });
});

app.get('/animal/:petid/vaccination', (req, res) => {
    const petid = req.params.petid;
    // console.log(petid);
    const INSERT_ANIMAL_QUERY = `SELECT vaccination.vac_type, vaccination.admin_date, vaccination.vac_number, vaccination.exp_date, vaccination.user_name, vaccinetypes.required_for_adoption FROM vaccination, vaccinetypes, animal 
    WHERE animal.pet_ID='${petid}' and animal.pet_ID = vaccination.pet_ID and animal.species_type = vaccinetypes.species_type and vaccination.vac_type = vaccinetypes.vaccine_name;`;
    connection.query(INSERT_ANIMAL_QUERY, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            // console.log(results);
            return res.json (
                {data: results}
            )
        }
    });
});

app.get('/species', (req, res) => {
    connection.query(`SELECT * FROM species`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json (
                {data: results}
            )
        }
    });
});

app.post('/api/new-animal', function(request, response) {
    console.log(request.body);
    const {animal_name, microchip_ID, description, alteration_status, sex, age, surrender_reason, surrender_date, by_animal_control, user_name, species_type, breed, vaccinations} = request.body;
    console.log(vaccinations);
    console.log(animal_name, alteration_status);
    let INSERT_ANIMAL_QUERY;
    if (microchip_ID === '') {
        INSERT_ANIMAL_QUERY = `INSERT INTO animal(animal_name, description, alteration_status, sex, age, surrender_reason, surrender_date, by_animal_control, user_name, species_type) VALUES('${animal_name}', '${description}', '${alteration_status}', '${sex}', '${age}', '${surrender_reason}', '${surrender_date}', '${by_animal_control}', '${user_name}', '${species_type}')`;
    } else {
        INSERT_ANIMAL_QUERY = `INSERT INTO animal(animal_name, microchip_ID, description, alteration_status, sex, age, surrender_reason, surrender_date, by_animal_control, user_name, species_type) VALUES('${animal_name}', '${microchip_ID}', '${description}', '${alteration_status}', '${sex}', '${age}', '${surrender_reason}', '${surrender_date}', '${by_animal_control}', '${user_name}', '${species_type}')`;
    }
            connection.query(INSERT_ANIMAL_QUERY, (err, results) => {
                if (err) {
                    console.log('Inside second error.' + err);
                    return response.status(400).send(err);
                } else {
                    for (let step = 0; step < breed.length; step++) {
                        connection.query(`INSERT INTO animalspeciesbreeds(species_type, pet_ID, breed_name) VALUES('${species_type}', ${results.insertId}, '${breed[step]}')`, (err, results)=> {
                            if (err) {
                                console.log("I am in the second error");
                                return response.status(400).send(err);
                            }
                        });
                    if (vaccinations != '') {
                        for (let step = 0; step < vaccinations.length; step++) {
                            if (vaccinations[step].vac_type != ''){
                                connection.query(`INSERT INTO vaccination(pet_ID, vac_type, admin_date, vac_number, exp_date, user_name) VALUES(${results.insertId}, '${vaccinations[step].vac_type}', '${vaccinations[step].admin_date}', '${vaccinations[step].vac_number}', '${vaccinations[step].exp_date}', '${user_name}')`, (err, results)=> {
                                    if (err) {
                                        console.log("I am in the third error" + step + err);
                                        // return response.status(400).send(err);
                                    }
                                });
                            }
                        }
                    }
                      }
                    console.log('DATA INSERTED');
                    console.log(results);
                    console.log(results.insertId);
                    response.json({message: results.insertId});
                    // response.status(201).send({message: 'Data inserted!', pet_ID: results.insertID});
                    //connection.end();
                }
    })
});

app.put('/updateAnimal', (req, res) => {
    const {pet_ID, microchip_ID, alteration_status, sex, breed, species_type} = req.body;
    let UPDATE_ANIMAL_QUERY;
    if (microchip_ID === '') {
        UPDATE_ANIMAL_QUERY = `UPDATE animal SET alteration_status='${alteration_status}', sex='${sex}' WHERE pet_ID='${pet_ID}';DELETE FROM animalspeciesbreeds WHERE pet_ID='${pet_ID}';`;
    } else {
        UPDATE_ANIMAL_QUERY = `UPDATE animal SET microchip_ID='${microchip_ID}', alteration_status='${alteration_status}', sex='${sex}' WHERE pet_ID='${pet_ID}';DELETE FROM animalspeciesbreeds WHERE pet_ID='${pet_ID}';`;
    }
    connection.query(UPDATE_ANIMAL_QUERY, (err, results) => {
        if (err) {
            console.log('Inside first error.' + err);
            return res.status(400).send(err);
        } else {
            for (let step = 0; step < breed.length; step++) {
                connection.query(`INSERT INTO animalspeciesbreeds VALUES ('${species_type}', '${pet_ID}', '${breed[step]}')`, (err, results)=> {
                    if (err) {
                        console.log("I am in the second error");
                        return response.status(400).send(err);
                    }
            });
            }
            console.log(req.body);
            console.log('DATA UPDATED');
            res.status(201).send({message: 'Data updated!'});
            //connection.end();
        }
    });
});

app.get('/breeds', (req, res) => {
    connection.query(`SELECT * FROM SpeciesBreeds`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json (
                {data: results}
            )
        }
    });
});

app.get('/Vaccination', (req, res) => {
    connection.query(`SELECT * FROM vaccinetypes`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            // console.log("start printing vac types...");
            // console.log(results);
            return res.json (
                {data: results}
            )
        }
    });
});

app.post('/updateVaccination', function(request, response) {
    //console.log(request.body);
    const {pet_ID, vac_type, admin_date, vac_number, exp_date, user_name} = request.body;
    //console.log(animal_name, alteration_status);
    let INSERT_VACCINE_QUERY;
    if (vac_number === '') {
        INSERT_VACCINE_QUERY = `INSERT INTO vaccination(pet_ID, vac_type, admin_date, exp_date, user_name) VALUES('${pet_ID}', '${vac_type}', '${admin_date}', '${exp_date}', '${user_name}')`;
    } else {
        INSERT_VACCINE_QUERY = `INSERT INTO vaccination(pet_ID, vac_type, admin_date, vac_number, exp_date, user_name) VALUES('${pet_ID}', '${vac_type}', '${admin_date}', '${vac_number}', '${exp_date}', '${user_name}')`;
    }
            connection.query(INSERT_VACCINE_QUERY, (err, results) => {
                if (err) {
                    console.log('Inside second error.' + err);
                    return response.status(400).send(err);
                } else {
                    console.log('DATA INSERTED');
                    response.status(201).send({message: 'Data inserted!'});
                    //connection.end();
                }
    })
});

app.get('/selectyear',(req,res) =>{
    const provideyearquery = `SELECT DISTINCT YEAR (work_date) as year FROM VolunteerWorkhour;`;
    connection.query(provideyearquery, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            // console.log(results);
            return res.json (
                {data: results}
            )
        }
    });

})

app.get('/selectmonth',(req,res) =>{
    const providemonthquery = `SELECT DISTINCT MONTH (work_date) as month FROM VolunteerWorkhour;`;
    connection.query(providemonthquery, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            // console.log(results);
            return res.json (
                {data: results}
            )
        }
    });

})
app.get('/volmonth', (req, res) => {
    // const m = req.query.month;
    // const y = req.query.year;
    // console.log(m);
    // console.log(y);
    const selectmonthquery = `SELECT a.user_name as user_name, first_name, last_name, email,SUM(hour) as working_time, YEAR (work_date) as year, MONTH (work_date) as month FROM User a 
    JOIN VolunteerWorkhour b 
    ON a.user_name=b.user_name 
    GROUP BY user_name, first_name, last_name, email, year, month
    ORDER BY SUM(hour) DESC, last_name ASC`;
    connection.query(selectmonthquery,(err, results) => {
        if (err) {
            return res.send(err);
        } else {
            // console.log(results);
            return res.json (
                {data: results}
            )
        }
    });
});

app.get('/volyear', (req, res) => {

    const selectyearquery = 'SELECT a.user_name as user_name, first_name, last_name, email,SUM(hour) as working_time, YEAR (work_date) as year FROM User a  \
    JOIN VolunteerWorkhour b \
    ON a.user_name=b.user_name \
    GROUP BY user_name, first_name, last_name, email, year \
    ORDER BY SUM(hour) DESC, last_name ASC;' ;
    connection.query(selectyearquery,(err, results) => {
        if (err) {
            return res.send(err);
        } else {
            // console.log(results);
            return res.json (
                {data: results}
            )
        }
    });
});

app.get('/addadoption/add',function(request,response) {
    const {app_ID,pet_ID,adoption_date,adoption_fee} = request.query;
    const Insert_DATE_FEE =`INSERT INTO Adoption(app_ID,pet_ID,\
    adoption_date,adoption_fee)  VALUES('${app_ID}','${pet_ID}','${adoption_date}','${adoption_fee}')`;
    connection.query(Insert_DATE_FEE, (err,results)=>{
        if(err){
            console.log('Inser Error' + err);
            return response.send(err);
        }else{
            console.log('DATA INSERTED');
            response.send({message: 'Data inserted!'});
        }
    })
})      


app.get('/getApplicantTotalInfo',(req,res) =>{
    connection.query(SELECT_App_ContactInfo_Query, (err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data:results
            })
        }
    });
});

const SELECT_ALL_Application_Query = `SELECT app_ID,app_date,co_applicant_first_name, co_applicant_last_name,app_status,applicant_email FROM cs6400_p3_029.Application Where app_status = 'pending'`; 
app.get('/getAllApplicantion',(req,res) =>{
    connection.query(SELECT_ALL_Application_Query, (err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data:results
            })
        }
    });
});

const JOIN_AC_60_On_Month =`DROP view IF Exists a,b; CREATE VIEW a As SELECT YEAR(surrender_date) as year,MONTH (surrender_date) as month, COUNT(*) as animal_surrender_count FROM Animal WHERE TIMESTAMPDIFF(day, surrender_date,CURRENT_DATE) <= 180 and by_animal_control = True GROUP BY YEAR(surrender_date),MONTH (surrender_date); CREATE VIEW b As SELECT YEAR(adoption_date) as year, MONTH(adoption_date) as month, count(*) as animal_adopt_count FROM (SELECT a.pet_ID as pet_ID, adoption_date FROM Adoption a JOIN Animal b ON a.pet_ID=b.pet_ID WHERE DATEDIFF(a.adoption_date,b.surrender_date) >60 AND TIMESTAMPDIFF(day, adoption_date,CURRENT_DATE) <=180) c GROUP BY 1,2; SELECT year, month, COALESCE(animal_surrender_count,0) as animal_surrender_count,COALESCE(animal_adopt_count,0) AS animal_adopt_count FROM ( SELECT a.year, a.month,a.animal_surrender_count,b.animal_adopt_count from a left join b on a.year=b.year and a.month=b.month UNION SELECT b.year, b.month,a.animal_surrender_count,b.animal_adopt_count from a right join b on a.year=b.year and a.month=b.month) final order by year DESC, month DESC`;

app.get('/joinAC60OnMonth',(req,res) =>{
 connection.query(JOIN_AC_60_On_Month, (err,results)=>{
  if(err){
   return res.send(err)
  }
  else{
   return res.json({
    data:results[3]
   })
  }
 });
});



//



app.get('/60AnimalDetails/:year/:month',(req,res) =>{
 const year = req.params.year;
 const month = req.params.month;
 const ANIMAL_DETAILS_60 =`SELECT Animal.pet_ID, animal_name, sex, alteration_status, species_type, surrender_date, by_animal_control, microchip_ID, breed FROM Animal JOIN Adoption ON Animal.pet_ID=Adoption.pet_ID JOIN  (SELECT pet_ID,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed FROM AnimalSpeciesBreeds GROUP BY pet_ID) br ON Animal.pet_ID=br.pet_ID \
  WHERE Year (adoption_date) =  '${year}' and MONTH (Adoption.adoption_date) = '${month}' AND DATEDIFF(Adoption.adoption_date,Animal.surrender_date) >60 ORDER BY Animal.pet_ID ASC`;
 connection.query(ANIMAL_DETAILS_60, (err,results)=>{
  if(err){
   return res.send(err)
  }
  else{
   return res.json({
    data:results
   })
  }
 });
});


app.get('/AcAnimalDetails/:year/:month',(req,res) =>{
 const year = req.params.year;
 const month = req.params.month;
 const ANIMAL_DETAILS_60 =`SELECT Animal.pet_ID, animal_name, sex, alteration_status, species_type, surrender_date, by_animal_control, microchip_ID, breed
FROM Animal 
JOIN  (SELECT pet_ID,GROUP_CONCAT(DISTINCT breed_name ORDER BY breed_name ASC SEPARATOR '/') as breed
FROM AnimalSpeciesBreeds
GROUP BY pet_ID) br
ON Animal.pet_ID=br.pet_ID
WHERE MONTH (surrender_date) = ${month}
and Year (surrender_date) = ${year}
AND Animal.by_animal_control = True
ORDER BY Animal.pet_ID ASC;`;
 connection.query(ANIMAL_DETAILS_60, (err,results)=>{
  if(err){
   return res.send(err)
  }
  else{
   return res.json({
    data:results
   })
  }
 });
});

app.get('/updateapprove',(req,res) =>{
    const {app_id} = req.query;
    connection.query(`UPDATE Application SET app_status = 'Approved'  WHERE app_ID ='${app_id}';` , (err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data:results
            })
        }
    });
});


app.get('/updatereject',(req,res) =>{
    const {app_id} = req.query;
    connection.query(`UPDATE Application SET app_status = 'Rejected'  WHERE app_ID ='${app_id}';` , (err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data:results
            })
        }
    });
});        

app.get('/getAllEmailFromApp/',(req,res) =>{
	connection.query(`SELECT email FROM Applicant`, (err,results)=>{
		if(err){
			return res.send(err)
		}
		else{
			return res.json({
				data:results
			})
		}
	});
});

app.post('/insertIntoApplicant',(req, res) => {
	const {email, phone, first_name, last_name, city, street, state,zipcode} = req.body; 
	const INSERT_INTO_APPLICANT =`INSERT INTO Applicant VALUES('${email}', '${phone}', '${first_name}',\
	 '${last_name}', '${zipcode}', '${city}', '${street}', '${state}' );`;
	 connection.query(INSERT_INTO_APPLICANT, (err, results) => {
	 	if(err){
	 		return err;
	 	}else{
	 		console.log('updated applicant!')
	 		res.send("this is udpate applicant page!")
	 	}
	 });
});

app.post('/insertIntoApplication',(req, res) => {
	console.log(req.body);
	const {app_date,co_applicant_first_name, co_applicant_last_name,app_status,applicant_email} = req.body; 
	console.log(app_date);
	console.log(co_applicant_first_name);
	console.log(co_applicant_last_name);
	console.log(app_status);
	console.log(applicant_email);

	let INSERT_INTO_APPLICATION;
	if (co_applicant_first_name == "" || co_applicant_last_name ==""){
	  INSERT_INTO_APPLICATION =`INSERT INTO Application (app_date,\
	 app_status, applicant_email) VALUES('${app_date}',\
	 '${app_status}',  '${applicant_email}');`;
	}else{
	 INSERT_INTO_APPLICATION =`INSERT INTO Application (app_date, co_applicant_first_name, co_applicant_last_name,\
	 app_status, applicant_email) VALUES('${app_date}','${co_applicant_first_name}', '${co_applicant_last_name}', \
	 '${app_status}',  '${applicant_email}');`;
	}
	 connection.query(INSERT_INTO_APPLICATION, (err, results) => {
	 	if(err){
	 		console.log(err);
	 		return err
	 	}else{
             console.log('updated applicant!');
             console.log(results);
             res.json({message: results.insertId});
	 	}
	 });
});

const GET_APPLICATION_ID =`SELECT MAX(app_ID) as max_ID FROM application`;
app.get('/getApplicationID',(req,res)=>{
    connection.query(GET_APPLICATION_ID, (err, results) => {
        if (err) {
            console.log('Inside 1st error.' + err);
        }
        else {
            console.log('Updated');
            return res.json({
				data: results[0]
			})

        }
    });
});

const port = process.env.PORT || 4000;
app.listen(port);

console.log('App is listening on port ' + port);

// app.listen(4000, () => {
//     console.log('Products sever listening on port 4000');
// });