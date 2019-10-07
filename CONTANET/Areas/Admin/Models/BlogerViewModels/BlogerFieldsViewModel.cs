using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CONTANET.Areas.Admin.Models.BlogerViewModels
{
    public class BlogerFieldsViewModel
    {
        [Required(ErrorMessage = "El campo '{0}' es obligatorio")]
        [Display(Name = "Nombres")]
        public string Name { get; set; }

        [Required(ErrorMessage = "El campo '{0}' es obligatorio")]
        [Display(Name = "Apellido Paterno")]
        public string PaternalSurname { get; set; }

        [Required(ErrorMessage = "El campo '{0}' es obligatorio")]
        [Display(Name = "Apellido Materno")]
        public string MaternalSurname { get; set; }

        [Required(ErrorMessage = "El campo '{0}' es obligatorio")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "{0} no válido")]
        [Display(Name = "Correo electrónico")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El campo '{0}' es obligatorio")]
        [StringLength(maximumLength: 9, MinimumLength = 9, ErrorMessage = "El campo '{0}' debe tener {1} dígitos")]
        [RegularExpression("[1-9][0-9]*", ErrorMessage = "{0} no válido")]
        [Display(Name = "Teléfono")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "El campo '{0}' es obligatorio")]
        [StringLength(maximumLength: 9, MinimumLength = 8, ErrorMessage = "El campo '{0}' debe tener {1} dígitos")]
        [Display(Name = "Dni")]
        public string Dni { get; set; }

        [Required(ErrorMessage = "El campo '{0}' es obligatorio")]
        [Display(Name = "Usuario")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "El campo {0} es obligatorio")]
        [DataType(DataType.Password)]
        [StringLength(maximumLength: 256, MinimumLength = 6, ErrorMessage = "El campo '{0}' debe tener {1}-{2} caracteres")]
        [Display(Name = "Contraseña")]
        public string Password { get; set; }

        [Required(ErrorMessage = "El campo '{0}' es obligatorio")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Las contraseñas especificadas no coinciden")]
        [Display(Name = "Confirmar contraseña")]
        public string ConfirmedPassword { get; set; }
         
    }
}
