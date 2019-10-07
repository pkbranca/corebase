using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CONTANET.Helpers
{
    public class ConstantHelpers
    {
        public static class ROLES
        {
            public const string BLOGER = "Bloger"; 
            public const string SUPERADMIN = "Superadmin"; 
        }

        public static class SEEDS
        {
            public const bool ENABLED = false;
            public const string IDENTITY_ROLE = "ApplicationRoleSeed";
            public const string USER_ROLE = "UserRoleSeed";
            public static readonly List<string> PRIORITIES = new List<string>()
            {
                "ApplicationRoleSeed",
                "UserRoleSeed"
            };
        }

    }
}
