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
    public class RoleController : ApiController
    {
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;
        [HttpGet]
        public List<Roles> GetRoles()
        {
            List<Roles> role = new List<Roles>();
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = @"Select * from Roles";
                SqlCommand cmd = new SqlCommand(query, con);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Roles r = new Roles();

                    r.RoleID = Convert.ToInt32(rdr["RoleID"]);
                    r.RoleName = rdr["RoleName"].ToString();
                    role.Add(r);
                }
            }
            return role;
        }
    }
}
