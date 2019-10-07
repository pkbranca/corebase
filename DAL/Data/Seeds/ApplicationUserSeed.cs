using DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Data.Seeds
{
    public class ApplicationUserSeed
    {
        public static ApplicationUser[] Seed()
        {
            var result = new List<ApplicationUser>()
            {
                new ApplicationUser { Email = "srbrancacho@gmail.com", EmailConfirmed = true, Name = "Superadmin", UserName = "superadmin", Dni = "71252283" },
                new ApplicationUser { Email = "srbrancacho@gmail.com", EmailConfirmed = true, Name = "Bloger", UserName = "bloger", Dni = "71252284" },
            };

            return result.ToArray();
        }
    }
}
