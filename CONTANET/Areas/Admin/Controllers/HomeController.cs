using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CONTANET.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CONTANET.Areas.Admin.Controllers
{
    [Authorize]
    //[Authorize(Roles = ConstantHelpers.ROLES.SUPERADMIN)]
    [Area("Admin")]
    [Route("admin/inicio")]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}