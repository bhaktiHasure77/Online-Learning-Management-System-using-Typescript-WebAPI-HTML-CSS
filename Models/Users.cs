using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OnlineLearningManagementSystem.Models
{
    public class Users
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Pass { get; set; }
        public int RoleID { get; set; }
    }
}