using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pmesp.GerApp.Administrador.Application.Models
{
    public class MenuViewModel
    {
        public int Id { get; set; }
        public int Pai { get; set; }
        public int Posicao { get; set; }
        public string Nome { get; set; }
        public string Area { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
    }
    

}
