using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string PaternalSurname { get; set; }
        public string MaternalSurname { get; set; }

        [NotMapped]
        public string RawFullName => $"{Name} {PaternalSurname} {MaternalSurname}";

        [NotMapped]
        public string FullName => $"{PaternalSurname} {MaternalSurname}, {Name}";

        public int Sex { get; set; }
        public DateTime BirthDate { get; set; }



        public string Dni { get; set; }
        public string Address { get; set; }
        public ICollection<ApplicationUserRole> UserRoles { get; set; }
    }
}
