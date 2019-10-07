using DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Data.Seeds
{
    public class ApplicationRoleSeed
    {
        public static ApplicationRole[] Seed()
        {
            var result = new List<ApplicationRole>()
            {
                new ApplicationRole { Name = "Superadmin" },
                new ApplicationRole { Name = "Bloger" },
            };
            return result.ToArray();
        }
    }
}
