using DAL.Models.Base.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Models.Base.Implementation
{
    public class Timestamp : ITimestamp
    {
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        //[NotMapped]
        //public string ParsedCreatedAt => CreatedAt.ToLocalDateTimeFormat();

        //[NotMapped]
        //public string ParsedUpdatedAt => UpdatedAt.ToLocalDateTimeFormat();
    }
}
