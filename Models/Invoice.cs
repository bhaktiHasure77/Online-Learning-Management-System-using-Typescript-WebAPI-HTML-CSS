using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineLearningManagementSystem.Models
{
    public class Invoice
    {
        public int InvoiceID { get; set; }
        public int UserID { get; set; }
        public int CourseID { get; set; }
        public int EnrollID { get; set; }
        public double TotalPrice{ get; set; }
    }
}