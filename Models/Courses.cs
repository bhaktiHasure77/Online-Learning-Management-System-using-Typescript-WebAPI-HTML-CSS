using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineLearningManagementSystem.Models
{
    public class Courses
    {
        public int CourseID { get; set; }
        public string CourseName { get; set; }
        public string Image { get; set; }
        public string DSC { get; set; }
        public double Price { get; set; }
        public int UserID { get; set; }
        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
    }
}