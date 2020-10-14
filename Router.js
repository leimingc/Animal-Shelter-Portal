// const bcrypt = require('bcrypt');
class Router {
    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
    }
    login(app, db) {
        app.post('/login', (req, res)=>{
            let username = req.body.username;
            let password = req.body.password;
            // username = username.toLowerCase();
            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: 'An error occurred, please try again'
                })
                return;
            }
            let cols = [username];
            db.query('SELECT * FROM user WHERE user_name=? LIMIT 1', cols, (err, data, fields)=>{
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occurred, please try again2'
                    })
                    return;
                }
                //Found user
                if (data && data.length === 1) {
                    let verified = (password === data[0].password)
                    // bcrypt.compare(password, data[0].password, (bcryptErr, verified)=>{
                        if (verified) {
                            req.session.username = data[0].user_name;
                            req.session.usertype = data[0].user_type;
                            res.json({
                                success: true,
                                username: data[0].user_name,
                                usertype: data[0].user_type
                            });
                            return;
                        } else {
                            res.json({
                                success: false,
                                msg: 'Invalid password'
                            });
                        }
                    // });
                } else {
                    res.json({
                        success: false,
                        msg: 'User not found, please try again'
                    })
                }
            });
        })
    }
    logout(app, db) {
        app.post('/logout', (req, res) => {
            if (req.session.username) {
                req.session.destroy();
                res.json({
                    success:true
                })
                return true;
            } else {
                res.json({
                    success: false
                })
                return false;
            }
        });
    }
    isLoggedIn(app, db) {
        app.post('/isLoggedIn', (req, res) => {
            if (req.session.username) {
                let cols = [req.session.username];
                db.query('SELECT * FROM user WHERE user_name= ? LIMIT 1', cols, (err, data, fields) => {
                    if (data && data.length === 1) {
                        res.json({
                            success: true,
                            username: data[0].user_name,
                            usertype: data[0].user_type
                        })
                        return true;
                    } else {
                        res.json({
                            success: false
                        })
                    }
                });
            }
            else {
                res.json({
                    success: false
                })
            }
        });
    }
}

module.exports = Router;