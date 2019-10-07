using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models.Base.Interface
{
    public interface ISoftDelete : ITimestamp
    {
        DateTime? DeletedAt { get; set; }
    }
}
