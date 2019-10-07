using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace DAL.Extensions
{
    public static class ClaimExtensions
    {
        public static string GetEmail(this ClaimsPrincipal user)
        {
            if (user.Identity.IsAuthenticated)
            {
                return user.Claims.FirstOrDefault(v => v.Type == ClaimTypes.Email).Value;
            }

            return "";
        }

        public static string GetFullName(this ClaimsPrincipal user)
        {
            if (user.Identity.IsAuthenticated)
            {
                return user.Claims.FirstOrDefault(v => v.Type == ClaimTypes.UserData).Value;
            }

            return "";
        }

        public static string GetPhone(this ClaimsPrincipal user)
        {
            if (user.Identity.IsAuthenticated)
            {
                return user.Claims.FirstOrDefault(v => v.Type == ClaimTypes.HomePhone).Value;
            }

            return "";
        }

        public static string GetPictureUrl(this ClaimsPrincipal user)
        {
            if (user.Identity.IsAuthenticated)
            {
                //return user.Claims.FirstOrDefault(v => v.Type == "PictureUrl").Value;
                return "";
            }

            return "";
        }

        public static string GetRoles(this ClaimsPrincipal user)
        {
            if (user.Identity.IsAuthenticated)
            {
                return user.Claims.FirstOrDefault(v => v.Type == ClaimTypes.Role).Value;
            }

            return "";
        }
        /*
        public static bool HasPermission(this ClaimsPrincipal principal, PermissionHelpers.Permission role)
        {
            var _claim = principal.Claims.FirstOrDefault(x => x.Type == "AkdemicPermissions");

            var roleLabel = Enum.GetName(typeof(PermissionHelpers.Permission), role);

            var _roles = _claim.ToString().Split(',');

            foreach (var _r in _roles)
                if (_r == roleLabel)
                    return true;

            return false;
        }

        public static bool HasPermission(this ClaimsPrincipal principal, PermissionHelpers.Permission[] roles)
        {

            var _claim = principal.Claims.FirstOrDefault(x => x.Type == "AkdemicPermissions");

            var _roles = _claim.ToString().Split(',');

            foreach (var r in roles)
            {
                var roleLabel = Enum.GetName(typeof(PermissionHelpers.Permission), r);

                foreach (var _r in _roles)
                    if (_r == roleLabel)
                        return true;
            }

            return false;
        }*/
    }
}
