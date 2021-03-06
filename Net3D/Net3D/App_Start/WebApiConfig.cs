﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Reflection;
using System.Web.Http.Dispatcher;
using System.Text;
using System.Diagnostics;

namespace Net3D
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
