using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models
{
    public class ApplicationRole : IdentityRole
    {
        [NotMapped]
        public bool IsInProcedure { get; set; }

        public bool IsStatic { get; set; }

        //public ICollection<ProcedureRole> ProcedureRoles { get; set; }

        public ICollection<ApplicationUserRole> UserRoles { get; set; }

    }
}
