## Getting Started

Instructions to get the web application running on a local machine.

### Prerequisites 

What must be installed to run the software:

```
nodejs, sqlite3, express, ejs, nodemailer
```

### Installing
Initially, download and install nodejs

```
https://nodejs.org/en/download/
```

**How to run the application**:

Command line tool(s) must be used: Windows PowerShell or Mac Terminal

Note: Must run the command line tool(s) as an administrator or Sudo in Mac OS

**Cloning the Project**:

Clone the git master branch using the command line tool(s)

```
git clone https://git.cs.usask.ca/yol474/cmpt370-fantastic-4.git
```

Or use the Github Desktop to clone a repository to a designated path by entering the below URL

```
https://git.cs.usask.ca/yol474/cmpt370-fantastic-4.git
```

Navigate to the **cmpt370-fantastic-4** folder that contains **app.js** in the the command line tool(s)

```
cmpt370-fantastic-4/app.js
```

**Setting up required node modules**:

**First**, use npm to create an empty package

```
npm init
```
Keep pressing "Enter" until you see "Is this OK? (yes)"

Enter "yes" to continue

**Second**, use npm to install the following requirements

```
npm i sqlite3
npm i express
npm i ejs
npm i nodemailer
```
Note: if showing warning "Permission Denied", has to re-run command line tool(s)
      as an administrator or Sudo in Mac Os as indicated previously and repeat the above steps

**Last**, run app.js using command line

```
node app.js
```

Application will be live on port 2020

Enter below URL into your browser, Google Chrome recommended

```
localhost:2020/
```

If you would like a reference when booking a flight be sure to use a real email in the form.<br>
The site may need to be reactivated to have the latest booking information since
it is local.

### Wiki

Features details for all milestones and group members<br>

https://git.cs.usask.ca/yol474/cmpt370-fantastic-4/wikis