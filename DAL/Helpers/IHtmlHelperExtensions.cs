using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Internal;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Helpers
{
    public static class IHtmlHelperExtensions
    {
        public static async Task<IHtmlContent> PartialForAsync<TModel, TProperty>(this IHtmlHelper<TModel> helper,
            Expression<Func<TModel, TProperty>> expression, string partialViewName, string prefixName = "")
        {
            var model = ExpressionMetadataProvider.FromLambdaExpression(expression, helper.ViewData, helper.MetadataProvider).Model;
            var viewData = new ViewDataDictionary(helper.ViewData)
            {
                TemplateInfo = { HtmlFieldPrefix = prefixName }
            };

            return await helper.PartialAsync(partialViewName, model, viewData);
        }

        public static async Task<IHtmlContent> PartialForAsync<TModel>(this IHtmlHelper<TModel> helper, 
            string partialViewName, string prefixName = "")
        {
            var viewData = new ViewDataDictionary(helper.ViewData)
            {
                TemplateInfo = { HtmlFieldPrefix = prefixName }
            };
            viewData.Model = null;

            return await helper.PartialAsync(partialViewName, viewData);
        }
    }
}
