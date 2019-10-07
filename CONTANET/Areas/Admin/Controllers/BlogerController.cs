using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CONTANET.Areas.Admin.Models.BlogerViewModels;
using CONTANET.Controllers;
using CONTANET.Helpers;
using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CONTANET.Areas.Admin.Controllers
{
    [Authorize] 
    [Area("Admin")]
    [Route("admin/bloger")]
    public class BlogerController : BaseController
    {
        public BlogerController(ApplicationDbContext _context,
                                   UserManager<ApplicationUser> _userManager) : base(_context, _userManager) { }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("get/{condition}")]
        public async Task<IActionResult> GetBlogers(int? condition)
        {
            var query = _context.UserRoles 
                .AsQueryable();
             

            var result = 
             await _context.UserRoles.Include(x=>x.User)
             .Include(x=>x.Role)
             .Where(x=>x.Role.Name == "Bloger").Select(x => new
            {
                id = x.User.Id,
                names = x.User.Name,
                paternalSurname = x.User.PaternalSurname,
                maternalSurname = x.User.MaternalSurname,
                userName = x.User.UserName,
                fullname = $"{x.User.Name} {x.User.PaternalSurname} {x.User.MaternalSurname}", 
                email = x.User.Email
            }).ToListAsync();

            return Ok(result);
        }

        [HttpGet("agregar")]
        public IActionResult Add() => View();


        [HttpPost("agregar")]
        public async Task<IActionResult> Add(BlogerFieldsViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            if (_context.Users.Any(x => x.UserName.Equals(model.UserName)))
                return BadRequest("El usuario especificado ya se encuentra registrado.");
            //ModelState.AddModelError(nameof(model.UserName), "El usuario especificado ya se encuentra registrado.");

            if (_context.Users.Any(x => x.Email.Equals(model.Email)))
                return BadRequest("El correo electrónico especificado ya se encuentra registrado.");
            //ModelState.AddModelError(nameof(model.Email), "El correo electrónico especificado ya se encuentra registrado.");

            try
            {
                var passwordValidator = new PasswordValidator<ApplicationUser>();
                var passwordIsValid = passwordValidator.ValidateAsync(_userManager, new ApplicationUser(), model.Password).Result.Succeeded;
                if (!passwordIsValid)
                    return BadRequest("La contraseña debe contener al menos 1 letra mayúscula, 1 letra minúscula, 1 dígito y un caracter no alfanumérico.");
                //ModelState.AddModelError(nameof(model.Password), "La contraseña debe contener al menos 1 letra mayúscula, 1 letra minúscula, 1 dígito y un caracter no alfanumérico.");

                /*
                var teacher = new ENTITIES.Models.Generals.Teacher()
                {
                    TeacherInformation = new TeacherInformation()
                    {
                        Resolution = new Resolution(),
                    }
                };*/
                var user = new ApplicationUser();
                FillApplicationUser(ref user, model);
                var identityResult = await _userManager.CreateAsync(user, model.Password);

                if (!identityResult.Succeeded)
                    return BadRequest("Ocurrió un problema al registrar.");

                var identityRoleResult = await _userManager.AddToRoleAsync(user, ConstantHelpers.ROLES.BLOGER);

                if (!identityRoleResult.Succeeded)
                    return BadRequest("Ocurrió un problema al registrar.");

                //teacher.UserId = user.Id;
                //teacher.Condition = model.SelectedCondition;
                //teacher.TeacherDedicationId = model.SelectedDedication;
                //await _context.Teacher.AddAsync(teacher);

                //await SaveChangesAsync();
                await _context.SaveChangesAsync();
                //SuccessToastMessage("Registro del docente realizado.");
                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet("editar/{id}")]
        public async Task<IActionResult> Edit(String id)
        {
            try
            {
                if (id.Equals(Guid.Empty))
                    throw new ApplicationException($"No se pudo encontrar el usuario con el id {id}.");
                 

                ApplicationUser user = await _context.Users
                                    .FirstOrDefaultAsync(x => x.Id == id);
                //var teacher = await _context.Teacher.FirstOrDefaultAsync(x => x.UserId == user.Id);

                var model = new EditBlogerViewModel()
                {
                    Id = user.Id,
                    Fields = new BlogerFieldsViewModel()
                    {
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        UserName = user.UserName,
                        PaternalSurname = user.PaternalSurname,
                        MaternalSurname = user.MaternalSurname,
                        Name = user.Name,
                        Dni = user.Dni, 
                    }, 
                };
                
                return View(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [Route("eliminar/post")]
        [HttpPost]
        public async Task<IActionResult> Delete(string id)
        {

            ApplicationUser user = _context.Users.FirstOrDefault(x => x.Id.Equals(id));

            if (user != null)
            {
                var rolesToRemove = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                //_context.UserDependencies.RemoveRange(user.UserDependencies);

                 
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
               // await SaveChangesAsync();
                return Ok();
            }
            return BadRequest();
        }

        [NonAction]
        private void FillEditApplicationUser(ref ApplicationUser user, BlogerFieldsViewModel model)
        {
            user.Name = model.Name;
            user.PaternalSurname = model.PaternalSurname;
            user.MaternalSurname = model.MaternalSurname;
            user.Email = model.Email;
            user.UserName = model.UserName;
            user.PhoneNumber = model.PhoneNumber;
        }

        [NonAction]
        private void FillApplicationUser(ref ApplicationUser user, BlogerFieldsViewModel model)
        {
            user.Name = model.Name;
            user.PaternalSurname = model.PaternalSurname;
            user.MaternalSurname = model.MaternalSurname;
            user.Email = model.Email;
            user.UserName = model.UserName;
            user.PhoneNumber = model.PhoneNumber;
            user.Dni = model.Dni;
        }

    }
}