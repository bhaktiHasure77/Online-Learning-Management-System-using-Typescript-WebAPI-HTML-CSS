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
    public class InvoiceController : ApiController
    {
        string str = ConfigurationManager.ConnectionStrings["MyCon"].ConnectionString;

        [HttpGet]
        public List<Invoice> GetBill(int id)
        {
            List<Invoice> billD = new List<Invoice>();
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = @"Select * from Invoice";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@id", id);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Invoice bd = new Invoice();

                    bd.InvoiceID = Convert.ToInt32(rdr["InvoiceID"]);
                    bd.UserID = Convert.ToInt32(rdr["UserID"]);

                    bd.CourseID = Convert.ToInt32(rdr["CourseID"]);
                    bd.EnrollID = Convert.ToInt32(rdr["EnrollID"]);
                    bd.TotalPrice = Convert.ToInt32(rdr["TotalPrice"]);

                    billD.Add(bd);
                }
            }
            return billD;
        }
        [HttpPost]
        public string InsertInvoice(List<Invoice> items)
        {
            string res = " ";
            using (SqlConnection con = new SqlConnection(str))
            {
                con.Open();
                foreach (var v in items)
                {
                    string query = @"INSERT INTO Invoice 
                            ( UserID,EnrollID,CourseID, TotalPrice) 
                            VALUES (@uid,@bid, @pid, @amt)";

                    SqlCommand cmd = new SqlCommand(query, con);


                    cmd.Parameters.AddWithValue("@bid", v.EnrollID);
                    cmd.Parameters.AddWithValue("@pid", v.CourseID);
                    cmd.Parameters.AddWithValue("@uid", v.UserID);
                    cmd.Parameters.AddWithValue("@amt", v.TotalPrice);

                    cmd.ExecuteNonQuery();

                }
                res = "Invoice Generated";

            }

            return res;
        }


        [HttpDelete]
        public string DeleteBill(int id)
        {
            using (SqlConnection con = new SqlConnection(str))
            {
                string query = "Delete From Invoice Where EnrollID=@bid";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@bid", id);
                con.Open();
                cmd.ExecuteNonQuery();
            }
            return "Bill Deleted Succesfully!!";
        }

    }
}
