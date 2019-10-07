using DAL.Data.Seeds;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public static class DbInitializer
    {
         
        public static void SeedDb(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            context.Database.EnsureCreated();
            SeedRoles(context,roleManager).Wait();
            SeedUsers(context,userManager).Wait();
            SeedUserRoles(context);
        }

        private static async Task SeedRoles(ApplicationDbContext context, RoleManager<ApplicationRole> roleManager)
        {
            var roles = ApplicationRoleSeed.Seed();
            foreach (var role in roles)
            {
                var identityResult = roleManager.CreateAsync(role).Result;
                if (identityResult.Succeeded)
                { 
                    context.SaveChanges();
                }
            } 
        }

        private static async Task SeedUsers(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            var users = ApplicationUserSeed.Seed();
            foreach (var user in users)
            {
                var identityResult = await userManager.CreateAsync(user);
                if (identityResult.Succeeded)
                { 
                    identityResult = await userManager.AddPasswordAsync(user, "Bloger.2018");
                    context.SaveChanges();
                }
            } 
        }

        private static void SeedUserRoles(ApplicationDbContext context)
        { 

            var userRoles = ApplicationUserRoleSeed.Seed(context);
            context.UserRoles.AddRange(userRoles);
            context.SaveChanges();
        } 
    }
}
