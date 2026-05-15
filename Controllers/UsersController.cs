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
    // API Controller for User-related operations

    public class UsersController : ApiController
    {

        // Database connection string
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all users with their user type details
        [HttpGet]
        public List<Users> GetUsers()
        {
            // List to store user data
            List<Users> users = new List<Users>();

            using (SqlConnection con = new SqlConnection(str))
            {
                // Join Users table with UserType table
                string query = @"Select * From Users";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open DB connection

                SqlDataReader rdr = cmd.ExecuteReader();

                // Read each record from result set
                while (rdr.Read())
                {
                    Users ud = new Users();

                    // Map database columns to model properties
                    ud.UserID = Convert.ToInt32(rdr["UserID"]);
                    ud.UserName = rdr["UserName"].ToString();
                    ud.Email = rdr["Email"].ToString();
                    ud.Pass = rdr["Pass"].ToString();
                    ud.RoleID = Convert.ToInt32(rdr["RoleID"]);

                    users.Add(ud);
                }
            }

            return users;
        }

        // POST: Insert a new user
        [HttpPost]
        public string InsertUser(Users ud)
        {
            string res = " ";

            using (SqlConnection con = new SqlConnection(str))
            {
                // SQL query to insert user data
                string query = @"Insert Into Users(UserName, Email, Pass, RoleID) 
                                 values(@name, @email, @pwd, @tid)";

                SqlCommand cmd = new SqlCommand(query, con);

                // Add parameters to prevent SQL injection
                cmd.Parameters.AddWithValue("@name", ud.UserName);
                cmd.Parameters.AddWithValue("@email", ud.Email);
                cmd.Parameters.AddWithValue("@pwd", ud.Pass);
                cmd.Parameters.AddWithValue("@tid", ud.RoleID);

                con.Open();

                // Execute insert query
                int row = cmd.ExecuteNonQuery();

                // Check result
                if (row > 0)
                {
                    res = "User Added!!";
                }
                else
                {
                    res = "Error Inserting User!!";
                }
            }

            return res;
        }
        [HttpDelete]
        public string DeleteUser(int id)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = "Delete From Users Where UserID=@uid";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@uid", id);
                con.Open();
                cmd.ExecuteNonQuery();
            }
            return "User Deleted Succesfully!!";
        }
   }
}
