using DAL.Models.Base.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models.Base.Implementation
{
    public class SoftDelete : Timestamp, ISoftDelete
    {
        public DateTime? DeletedAt { get; set; }

         
    }
}
