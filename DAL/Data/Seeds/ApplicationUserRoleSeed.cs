using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL.Data.Seeds
{
    public class ApplicationUserRoleSeed
    {
        public static ApplicationUserRole[] Seed(ApplicationDbContext context)
        {
            var roles = context.Roles.ToList();
            var users = context.Users.ToList();

            var result = new List<ApplicationUserRole>()
            {
                new ApplicationUserRole { RoleId = roles.FirstOrDefault(x => x.Name == "Superadmin").Id, UserId = users.FirstOrDefault(x=>x.UserName == "superadmin").Id},
                new ApplicationUserRole { RoleId = roles.FirstOrDefault(x => x.Name == "Bloger").Id, UserId = users.FirstOrDefault(x=>x.UserName == "bloger").Id},

            };
            return result.ToArray();
        }
    }
}
