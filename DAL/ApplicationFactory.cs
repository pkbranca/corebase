using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{
    public class ApplicationFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationFactory()
        {
        }
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
            builder.UseMySql(
               "Server=localhost;Database=Conet;user=root;pwd=root"
               //"Server=tcp:bwr9tqktu5.database.windows.net,1433;Initial Catalog=UNICA.INTRANET.DB;Persist Security Info=False;User ID=em3;Password=Enchufate2015;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
               );

            return new ApplicationDbContext(builder.Options);
        }
    }
}
