using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CONTANET.Areas.Admin.Models.BlogerViewModels
{
    public class BlogerViewModel
    {
        public String Id { get; set; }

        public BlogerFieldsViewModel Fields { get; set; }
    }
}
