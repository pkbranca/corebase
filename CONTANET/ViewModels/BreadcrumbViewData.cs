using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CONTANET.ViewModels
{
    public class BreadcrumbViewData
    {
        public string Name { get; set; }
        public string Area { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public string Url { get; set; }
    }
}
