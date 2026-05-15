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
    public class EnrollmentController : ApiController
    {
        // Database connection string
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        // GET: Retrieve all Enrollment details records
        [HttpGet]
        public List<Enrollment> GetEnrollment()
        {
            // List to store Enrollment details
            List<Enrollment> EnrollmentD = new List<Enrollment>();

            using (SqlConnection con = new SqlConnection(str))
            {
                // Query to fetch all Enrollment details
                string query = @"select * from Enrollments";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open(); // Open DB connection

                SqlDataReader rdr = cmd.ExecuteReader();

                // Read each row from result set
                while (rdr.Read())
                {
                    // Create new Enrollment object for each row
                    Enrollment bd = new Enrollment();

                    // Map database columns to model properties
                    bd.EnrollID = Convert.ToInt32(rdr["EnrollID"]);
                    bd.UserID = Convert.ToInt32(rdr["UserID"]);
                    bd.Date = rdr["EnrollmentDate"].ToString();

                    // Add to list
                    EnrollmentD.Add(bd);
                }
            }

            // Return list of Enrollment details
            return EnrollmentD;
        }

        // POST: Insert Enrollment details for multiple cart items (generate Enrollment)
        [HttpPost]
        public string InsertEnrollment(Cart c)
        {
            string res = " ";

            using (SqlConnection con = new SqlConnection(str))
            {
                con.Open(); // Open connection once for batch insert

                // Loop through cart items and insert each as a Enrollment detail

                string query = "INSERT INTO Enrollments(UserID, EnrollmentDate) VALUES(@uid, GETDATE())";

                SqlCommand cmd = new SqlCommand(query, con);

                // Add parameters to prevent SQL injection
                cmd.Parameters.AddWithValue("@uid", c.UserID);

                // Execute insert for each item
                cmd.ExecuteNonQuery();


                // Final response after inserting all items
                res = "Enrollment Generated";
            }

            return res;

        }
    }
}

