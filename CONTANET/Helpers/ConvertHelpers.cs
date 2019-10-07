using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CONTANET.Helpers
{
    public class ConvertHelpers
    {

        public static string ErrorCodeToText(int errorCode)
        {
            switch (errorCode)
            {
                case 401:
                    return "Acceso no autorizado";
                case 403:
                    return "Acceso denegado";
                case 404:
                    return "Recurso no encontrado";
                case 500:
                    return "Ocurrió un problema en el servidor";
                default:
                    return "Ocurrió un problema en el servidor";
            }
        }

        public static string ErrorCodeToText(string errorCode)
        {
            if (int.TryParse(errorCode, out int tmpErrorCode))
            {
                return ErrorCodeToText(tmpErrorCode);
            }

            return null;
        }

    }
}
