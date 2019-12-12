using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Pmesp.GerApp.Administrador.Application.Core;
using Pmesp.GerApp.Administrador.Application.Models;


namespace Pmesp.GerApp.Administrador.Application.Controllers
{

    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
       
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {

            return View();
        }
        public IActionResult Menu()
        {
            MenuViewModel menupai1 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 1, Id = 1, Posicao = 1, Nome = "App Emergência" };
            MenuViewModel menupai2 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 2, Id = 2, Posicao = 1, Nome = "Registro de ocorrência" };
            MenuViewModel menupai3 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 3, Id = 3, Posicao = 1, Nome = "Terminal embarcado" };
            MenuViewModel menupai4 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 4, Id = 4, Posicao = 1, Nome = "SOS Mulher" };

            MenuViewModel menusubfilho1 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 1, Id = 5, Posicao = 2, Nome = "Cadastro" };
            MenuViewModel menusubfilho2 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 1, Id = 6, Posicao = 2, Nome = "Consulta" };
            MenuViewModel menusubfilho3 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 1, Id = 7, Posicao = 2, Nome = "Relatório" };
            MenuViewModel menusubfilho4 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 1, Id = 8, Posicao = 2, Nome = "Auditoria" };
            MenuViewModel menusubfilho5 = new MenuViewModel { Action = "", Area = "", Controller = "", Pai = 1, Id = 9, Posicao = 2, Nome = "Adm. Sistema" };

            MenuViewModel menufilho1 = new MenuViewModel { Action = "Index", Area = "Auditoria", Controller = "AuditoriaSobDemanda", Pai = 8, Id = 10, Posicao = 3, Nome = "Auditoria sob demanda" };
            MenuViewModel menufilho2 = new MenuViewModel { Action = "Index", Area = "Auditoria", Controller = "AuditoriaInteligente", Pai = 8,  Id = 11, Posicao = 3, Nome = "Auditoria Inteligênte" };

            IEnumerable<MenuViewModel> model = new List<MenuViewModel> { menupai1, menupai2, menupai3, menupai4, menusubfilho1, menusubfilho2, menusubfilho3, menusubfilho4, menusubfilho5, menufilho1, menufilho2 };

            return PartialView("_MenuDinamico", model);
        }
        public IActionResult BreadCrumb(string caminho)
        {
            BreadCrumbViewModel breadCrumb;
            if (!string.IsNullOrEmpty(caminho))
            {
                var bread = caminho.Split('|');
                var list = bread.Select(p => int.Parse(p));
                var list2 = list.Select(p => ((MenuItens)p).ToString());
                breadCrumb = new BreadCrumbViewModel { Caminhos = list2 };
            }
            else
            {
                breadCrumb = new BreadCrumbViewModel { Caminhos = new List<string> { } };
            }
            return PartialView("_BreadCrumb", breadCrumb);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
