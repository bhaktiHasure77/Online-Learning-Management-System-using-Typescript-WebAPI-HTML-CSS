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
    public class CategoryController : ApiController
    {
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;
        [HttpGet]
        public List<Category> GetCategory()
        {
            List<Category> cat = new List<Category>();
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = @"Select * from Category";
                SqlCommand cmd = new SqlCommand(query, con);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Category c = new Category();

                    c.CategoryID = Convert.ToInt32(rdr["CategoryId"]);
                    c.CategoryName = rdr["CategoryName"].ToString();
                    cat.Add(c);
                }
            }
            return cat;
        }

    }
}
