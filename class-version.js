'use strict';
const mysql = require('mysql2');

// locally the connection doesn't work so until i find out how to
// solve this i can't guarantee the sql part is entirely correct
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'catalog'
});

class Person {
	constructor(name, birthdate=Date.now(), job='', id=0) {
		this.name = name;
		this.birthdate = birthdate;
		this.job = job;
		this.id = id;
	}

	static get(id) {
		let new_pers;
		let sql = "SELECT * FROM people WHERE id="+id;
		con.query(sql, function (err, result, fields) {
    		if (err) throw err;
    		console.log("Result: " + result);
    		new_pers = new Person(fields[0].name,
    			fields[0].birthdate, fields[0].job, id);
  		});
		return new_pers;
	}
}

class Employee extends Person {
	constructor(name, birthdate=Date.now(), id=0) {
		super(name, birthdate, 'emp', id);
	}

	static get(id) {
		let p = Person.get(id);
		let e = new Employee(p.name, p.birthdate, id);
		return e;
	}

	fire() {
		if (this.id === 0)
			return;
		let sql = "DELETE FROM people WHERE id="+id;
		con.query(sql, function (err, result) {
    		if (err) throw err;
    		console.log("Fired");
  		});
	}
	promote(new_job) {
		this.job = new_job;
		if (this.id === 0)
			return;
		let sql = "UPDATE people SET job='" + new_job + "' WHERE id=" + this.id;
		con.query(sql, function (err, result) {
    		if (err) throw err;
    		console.log("Promoted");
  		});
	}
}

class Mark {
	constructor(subject, mark) {
		this.subject = subject;
		this.mark = mark;
	}
}

class Student extends Person {
	constructor(name, birthdate=Date.now(), id=0) {
		super(name, birthdate, 'student', id);
		this.marks = [];
	}
	static get(id) {
		let p = Person.get(id);
		if (p.job !== 'student')
			return null;
		let s = new Student(p.name, p.birthdate, id);
		let sql = "SELECT * FROM marks WHERE id="+id;
		con.query(sql, function (err, result, fields) {
    		if (err) throw err;
    		console.log("Result: " + result);
    		for (let i=0; i<fields.length; i++) {
				this.marks.push(new Mark(fields[i].subject, fields[i].mark));
    		}
  		});
	}
}

class Teacher extends Employee {
	constructor(name, subject, birthdate=Date.now(), id=0) {
		super(name, birthdate, id);
		this.subject = subject;
		this.job = 'teacher';
	}

	evaluateStudent(student, mark) {
		student.marks.push(new Mark(this.subject, mark));
		if (student.id == 0)
			return;
		let sql = "INSERT INTO marks (id, subject, mark) VALUES(" + 
			s.id + ", '" + this.subject + "', " + mark + ")";
		con.query(sql, function (err, result) {
    		if (err) throw err;
    		console.log("Mark inserted");
  		});
	}

	static get(id) {
		let p = Person.get(id);
		if ((p.job != 'teacher') || (p.job != 'dephead'))
			return null;
		let t = new Teacher(p.name, p.subject, p.birthdate, id);
		return t;
	}
}

class Administrator extends Employee {
	constructor(name, birthdate=Date.now(), id=0) {
		super(name, birthdate, id);
		this.job = 'administrator';
	}

	static get(id) {
		let p = Person.get(id);
		if (p.job !== 'administrator')
			return null;
		let e = new Administrator(p.name, p.birthdate, id);
		return e;
	}
}

class ProDean extends Employee {
	constructor(name, birthdate=Date.now(), id=0) {
		super(name, birthdate, id);
		this.job = 'prodean';
	}

	static get(id) {
		let p = Person.get(id);
		if ((p.job !== 'prodean') && (p.job !== 'dean'))
			return null;
		let e = new ProDean(p.name, p.birthdate, id);
		return e;
	}
}

class DepartmentHead extends Teacher {
	constructor(name, subject, birthdate=Date.now(), id=0) {
		super(name, subject, birthdate, id);
		this.job = 'dephead';
	}

	static get(id) {
		let p = Person.get(id);
		if (p.job != 'dephead')
			return null;
		let t = new DepartmentHead(p.name, p.subject, p.birthdate, id);
		return t;
	}
}

class Dean extends ProDean {
	constructor(name, birthdate=Date.now(), id=0) {
		super(name, birthdate, id);
		this.job = 'dean';
	}

	static get(id) {
		let p = Person.get(id);
		if (p.job !== 'dean')
			return null;
		let e = new ProDean(p.name, p.birthdate, id);
		return e;
	}
}