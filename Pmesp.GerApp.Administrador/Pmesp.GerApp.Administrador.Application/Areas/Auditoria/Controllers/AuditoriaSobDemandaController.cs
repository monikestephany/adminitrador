using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Pmesp.GerApp.Administrador.Application.Areas.Auditoria.Controllers
{
    public class AuditoriaSobDemandaController : Controller
    {
       
        [Area("Auditoria")]
        public IActionResult Index()
        {
            return View();
        }
    }
}