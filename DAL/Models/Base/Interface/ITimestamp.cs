using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models.Base.Interface
{
    public interface ITimestamp
    {
        DateTime? CreatedAt { get; set; }
        DateTime? UpdatedAt { get; set; }
    }
}
