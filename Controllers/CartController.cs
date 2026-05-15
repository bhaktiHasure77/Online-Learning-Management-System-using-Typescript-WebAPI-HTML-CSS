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
    public class CartController : ApiController
    {
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;
        [HttpGet]
        public List<Cart> GetUsers()
        {
            List<Cart> cart = new List<Cart>();
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = @"Select * from Cart";

                SqlCommand cmd = new SqlCommand(query, con);
                //cmd.Parameters.AddWithValue("@name", name);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Cart c = new Cart();
                    c.CartID = Convert.ToInt32(rdr["CartID"]);
                    c.CourseID = Convert.ToInt32(rdr["CourseID"]);
                    c.UserID = Convert.ToInt32(rdr["UserID"]);
                    cart.Add(c);
                }
            }
            return cart;
        }
        [HttpPost]
        public string InsertCart(Cart c)
        {
            string res = " ";
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = @"Insert Into Cart(CourseID,UserID) values(@cid,@uid)";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@uid", c.UserID);
                cmd.Parameters.AddWithValue("@cid", c.CourseID);



                con.Open();

                int row = cmd.ExecuteNonQuery();
                if (row > 0)
                {
                    res = "Cart Added!!";
                }
                else
                {
                    res = "Error Inserting Cart!!";
                }

            }

            return res;
        }
       
        [HttpDelete]
        public string DeleteCart(int id)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = "Delete From Cart Where CourseID=@id";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@id", id);
                con.Open();
                cmd.ExecuteNonQuery();
            }
            return "Cart Deleted Succesfully!!";
        }
    }

}

