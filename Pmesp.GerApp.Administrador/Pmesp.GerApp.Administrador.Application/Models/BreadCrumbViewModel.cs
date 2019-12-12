using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pmesp.GerApp.Administrador.Application.Models
{
    public class BreadCrumbViewModel
    {
        public IEnumerable<string> Caminhos { get; set; }
    }
}
