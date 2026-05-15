using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineLearningManagementSystem.Models
{
    public class Cart
    {
        public int CartID { get; set; }

        public int CourseID { get; set; }
        public int UserID { get; set; }
    }
}