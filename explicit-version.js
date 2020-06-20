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

let Person = function (name, birthdate=Date.now(), job='', id=0) {
	this.name = name;
	this.birthdate = birthdate;
	this.job = job;
	this.id = id;
	this.get = function(id) {
		let new_pers;
		let sql = "SELECT * FROM people WHERE id="+id;
		console.log(sql);
		con.query(sql, function (err, result, fields) {
    		if (err) throw err;
    		console.log("Result: " + result);
    		new_pers = new Person(fields[0].name,
    			fields[0].birthdate, fields[0].job, id);
  		});
		return new_pers;
	}
}

let Employee = function (name, birthdate=Date.now(), id=0) {
	Person.call(this, name, birthdate, 'emp', id);
	this.get = function(id) {
		let p = Person.get(id);
		let e = new Employee(p.name, p.birthdate, id);
		return e;
	}

	this.fire = function() {
		if (this.id === 0)
			return;
		let sql = "DELETE FROM people WHERE id="+id;
		con.query(sql, function (err, result) {
    		if (err) throw err;
    		console.log("Fired");
  		});
	}

	this.promote = function(new_job) {
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

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

let Mark = function (subject, mark) {
	this.subject = subject;
	this.mark = mark;
}

let Student = function (name, birthdate=Date.now(), id=0) {
	Person.call(this, name, birthdate, 'student', id);
	this.marks = [];
	this.get = function(id) {
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

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

let Teacher = function (name, subject, birthdate=Date.now(), id=0) {
	Employee.call(this, name, birthdate, id);
	this.subject = subject;
	this.job = 'teacher';
	
	this.evaluateStudent = function(student, mark) {
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

	this.get = function(id) {
		let p = Person.get(id);
		if ((p.job != 'teacher') || (p.job != 'dephead'))
			return null;
		let t = new Teacher(p.name, p.subject, p.birthdate, id);
		return t;
	}
}

Teacher.prototype = Object.create(Employee.prototype);
Teacher.prototype.constructor = Teacher;

let Administrator = function (name, birthdate=Date.now(), id=0) {
	Employee.call(this, birthdate=Date.now(), id=0);
	this.job = 'administrator';
	this.get = function(id) {
		let p = Person.get(id);
		if (p.job !== 'administrator')
			return null;
		let e = new Administrator(p.name, p.birthdate, id);
		return e;
	}
}

Administrator.prototype = Object.create(Employee.prototype);
Administrator.prototype.constructor = Administrator;

let ProDean = function(name, birthdate=Date.now(), id=0) {
	Employee.call(this, birthdate=Date.now(), id=0);
	this.job = 'prodean';
	this.get = function(id) {
		let p = Person.get(id);
		if ((p.job !== 'prodean') && (p.job !== 'dean'))
			return null;
		let e = new ProDean(p.name, p.birthdate, id);
		return e;
	}
}

ProDean.prototype = Object.create(Employee.prototype);
ProDean.prototype.constructor = ProDean;

let DepartmentHead = function(name, subject, birthdate=Date.now(), id=0) {
	Teacher.call(this, name, subject, birthdate, id);
	this.job = 'dephead';
	this.get(id) = function(id) {
		let p = Person.get(id);
		if (p.job != 'dephead')
			return null;
		let t = new DepartmentHead(p.name, p.subject, p.birthdate, id);
		return t;
	}
}

DepartmentHead.prototype = Object.create(Teacher.prototype);
DepartmentHead.prototype.constructor = DepartmentHead;

let Dean = function(name, birthdate=Date.now(), id=0) {
	ProDean.call(this, name, birthdate=Date.now(), id=0);
	this.job = 'dean';
	this.get = function(id) {
		let p = Person.get(id);
		if (p.job !== 'dean')
			return null;
		let e = new ProDean(p.name, p.birthdate, id);
		return e;
	}
}

Dean.prototype = Object.create(ProDean.prototype);
Dean.prototype.constructor = Dean;
