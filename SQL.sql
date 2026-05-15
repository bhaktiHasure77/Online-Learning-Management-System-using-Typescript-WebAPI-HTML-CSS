--Create Table Roles(
--	RoleID INT Primary Key Identity,
--	RoleName Varchar(20)
--	);

Create Table Users(
	UserID INT Primary Key Identity,
	UserName Varchar(50),
	Email Varchar(50),
	Pass Varchar(50),
	RoleID INT Foreign Key References Roles(RoleID) on delete cascade not null
	);

--	Create Table Category(
--	CategoryID INT Primary Key Identity,
--	CategoryName Varchar(50)
--	);
Select * from Roles
Create Table Courses (
	CourseID INT Primary Key Identity,
	CourseName Varchar(50),
	Img Varchar(50),
	DSC Varchar(150),
	Price INT not null check(Price>=0),
	UserID INT Foreign Key References Users(UserID) On Delete Cascade not null,
	CategoryID INT Foreign Key References Category(CategoryID) On Delete Cascade not null
	);
	--Drop Table Courses
	
Create Table Enrollments(
	EnrollID INT Primary Key Identity,
	UserID INT Foreign Key References Users(UserID) On Delete NO Action,
	EnrollmentDate DateTime Default GetDate()
		);
	--Drop Table Enrollments

	Create Table Cart(
	CartID Int Primary Key Identity,
	CourseID Int  Foreign Key References Courses(CourseID) On Delete No Action,
	UserID Int Foreign Key References Users(UserID) On Delete No Action,
	);
	
	--Drop Table Cart

	Create Table Invoice(
	InvoiceID Int Primary Key Identity,
	UserID Int Foreign Key References Users(UserID) On Delete No Action,
	EnrollID  Int Foreign Key References Enrollments(EnrollID) On Delete No Action,
	CourseID Int Foreign Key References Courses(CourseID) on Delete Cascade,
	TotalPrice Int not null check(TotalPrice>0)
	);
--Drop Table Invoice

--	select * from Roles

select * from Users
select * from Enrollments
select * from Courses
select * from Invoice

		select * from roles

insert into Courses(CourseName,Img,DSC,Price,UserID,CategoryID) values('Web Development','img/Web Development.jfif','Web Development courses teach fundamental skills for creating and maintaining websites.',1999,5,1);
insert into Courses(CourseName,Img,DSC,Price,UserID,CategoryID)
 values('Python Programming',
 'img/Python.jfif',
'Python is a versatile programming language known for its simplicity and readability.',
 2999,5,1);
 --delete from Courses where CourseID=5
 insert into Courses(CourseName,Img,DSC,Price,UserID,CategoryID)
 values('Java Programing',
 'img/Java.jfif',
'Java courses cover everything from basic to advanced programming techniques, including object-oriented programming',
 2999,5,1);
 insert into Courses(CourseName,Img,DSC,Price,UserID,CategoryID)
 values('SQL',
 'img/SQL.jfif',
'SQL courses teach the language designed for working with databases.',
 1999,5,1);

 Select c.*,cat.CategoryName from Courses c inner join Category cat on c.CategoryID=cat.CategoryID