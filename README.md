# Project Manager

An application for managing projects and the teams in them.
The application  provide Users (logged in) with the functionality to logout, and view all teams, view all projects, view their profile, leave a team.
The admin is able to distribute users into teams and teams into projects. He also is able to create teams and projects.
The application provide Guest (not logged in) users with the functionality to login, register and view the Home page.
The admin should be seeded with the starting of the application. A registration of a new admin user should not be possible!
login admin:
email:admin@admin.bg
pass:admin0000



```sh
$ npm install
```

```sh
$ npm start
# Or run with Nodemon
$ npm run dev

# Visit http://localhost:5000
```

### MongoDB

Open "config/keys.js" and add your MongoDB URI, local or Atlas
