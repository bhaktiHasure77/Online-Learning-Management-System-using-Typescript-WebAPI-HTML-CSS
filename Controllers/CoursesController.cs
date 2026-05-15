using OnlineLearningManagementSystem.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace OnlineLearningManagementSystem.Controllers
{
    public class CoursesController : ApiController
    {

        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;
        [HttpGet]
        public List<Courses> GetCourse()
        {
            List<Courses> course = new List<Courses>();
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = @"Select c.*,cat.CategoryName from Courses c inner join Category cat on c.CategoryID=cat.CategoryID";
                SqlCommand cmd = new SqlCommand(query, con);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Courses c = new Courses();

                    c.CourseID = Convert.ToInt32(rdr["CourseID"]);
                    c.CourseName = rdr["CourseName"].ToString();
                    c.Price = Convert.ToInt32(rdr["Price"]);
                    c.Image= rdr["Img"].ToString();
                    c.DSC = rdr["DSC"].ToString();
                    c.UserID = Convert.ToInt32(rdr["UserID"]);
                    c.CategoryID = Convert.ToInt32(rdr["CategoryId"]);
                    c.CategoryName = rdr["CategoryName"].ToString();
                    course.Add(c);
                }
            }
            return course;
        }
        [HttpPost]
        public string InsertCourse(Courses c)
        {
            string res = " ";
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = @"Insert Into Courses(CourseName,Img,DSC,Price,UserID,CategoryId) values(@name,@img,@dsc,@price,@InstID,@cid)";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@name", c.CourseName);
                cmd.Parameters.AddWithValue("@img", c.Image);
                cmd.Parameters.AddWithValue("@price", c.Price);
                cmd.Parameters.AddWithValue("@dsc", c.DSC);
                cmd.Parameters.AddWithValue("@InstID", c.UserID);
                cmd.Parameters.AddWithValue("@cid", c.CategoryID);


                con.Open();
                int row = cmd.ExecuteNonQuery();
                if (row > 0)
                {
                    res = "Course Added!!";
                }
                else
                {
                    res = "Error Inserting Course!!";
                }

            }

            return res;
        }
        [HttpPut]
        public string UpdateCourse(Courses c)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = @"Update Courses Set CourseName=@name,
                                Price=@price, DSC=@dsc,UserID=@InstID,CategoryId=@cid Where CourseID=@pid";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@pid", c.CourseID);
                cmd.Parameters.AddWithValue("@name", c.CourseName);
                cmd.Parameters.AddWithValue("@price", c.Price);
                cmd.Parameters.AddWithValue("@dsc", c.DSC);
                cmd.Parameters.AddWithValue("@InstID", c.UserID);
                cmd.Parameters.AddWithValue("@cid", c.CategoryID);
                con.Open();
                cmd.ExecuteNonQuery();
            }
            return "Course Updated Successfully!!";
        }
        [HttpDelete]
        public string DeleteCourse(int id)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = "Delete From Courses Where CourseID=@id";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@id", id);
                con.Open();
                cmd.ExecuteNonQuery();
            }
            return "Course Deleted Succesfully!!";
        }
    }
}

